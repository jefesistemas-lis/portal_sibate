import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { OAuth2Client } from 'google-auth-library'

const app = express()
const PORT = Number(process.env.PORT) || 3001
const isProduction = process.env.APP_ENV === 'production'
const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173').split(',').map((origin) => origin.trim()).filter(Boolean)
const jwtSecret = process.env.JWT_SECRET || ''
const authorizedDomain = (process.env.AUTHORIZED_DOMAIN || 'lis.com.co').toLowerCase()
const googleClientId = process.env.GOOGLE_CLIENT_ID || ''
const superadminEmails = new Set(
  (process.env.SUPERADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
)
const bootstrapAdminEmail = [...superadminEmails][0] || 'admin@lis.com.co'
const googleClient = new OAuth2Client(googleClientId)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const STORE_DIR = path.join(__dirname, 'data')
const STORE_PATH = path.join(STORE_DIR, 'portal_store.json')

if (!googleClientId) {
  throw new Error('GOOGLE_CLIENT_ID es obligatorio.')
}

if (!jwtSecret || jwtSecret.length < 32 || jwtSecret === 'replace_with_strong_secret') {
  throw new Error('JWT_SECRET debe existir y tener al menos 32 caracteres.')
}

if (isProduction && allowedOrigins.some((origin) => !origin.startsWith('https://'))) {
  throw new Error('En producción, CORS_ORIGIN solo puede contener orígenes HTTPS.')
}

const ROLE_PRIORITY = {
  superadmin: 5,
  admin: 4,
  seguridad: 3,
  acis: 3,
  viewer: 1,
}

const ROLE_PERMISSIONS = {
  superadmin: ['manage_users', 'manage_roles', 'view_audit', 'view_security', 'view_acis', 'manage_inspections', 'manage_training'],
  admin: ['manage_users', 'manage_roles', 'view_audit', 'view_security', 'view_acis', 'manage_inspections', 'manage_training'],
  seguridad: ['view_security', 'manage_inspections', 'manage_training'],
  acis: ['view_acis'],
  viewer: [],
}

const ensureStore = () => {
  if (!fs.existsSync(STORE_DIR)) {
    fs.mkdirSync(STORE_DIR, { recursive: true })
  }

  if (!fs.existsSync(STORE_PATH)) {
    const initialStore = {
      users: [
        {
          email: bootstrapAdminEmail,
          name: 'Admin Sistemas',
          role: 'superadmin',
          status: 'active',
          permissions: ROLE_PERMISSIONS.superadmin,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login: null,
        },
      ],
      audit_logs: [
        {
          id: 'seed-boot',
          email: 'system',
          action: 'system_initialized',
          module: 'core',
          details: { message: 'Sistema de permisos y auditoría inicializado.' },
          success: true,
          ip_address: '127.0.0.1',
          user_agent: 'system',
          created_at: new Date().toISOString(),
        },
      ],
    }

    fs.writeFileSync(STORE_PATH, JSON.stringify(initialStore, null, 2))
  }
}

const loadStore = () => {
  ensureStore()
  const raw = fs.readFileSync(STORE_PATH, 'utf8')
  try {
    return JSON.parse(raw)
  } catch (error) {
    return { users: [], audit_logs: [] }
  }
}

const saveStore = (store) => {
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2))
}

const createUserRecord = (email, name, role = 'viewer', status = 'active') => ({
  email: String(email || '').toLowerCase(),
  name: name || String(email || 'Usuario'),
  role,
  status,
  permissions: ROLE_PERMISSIONS[role] || [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  last_login: null,
})

const determineRoleFromEmail = (email) => {
  const normalizedEmail = String(email || '').toLowerCase()

  if (superadminEmails.has(normalizedEmail)) {
    return 'superadmin'
  }

  if (normalizedEmail.includes('seguridad') || normalizedEmail.includes('safety')) {
    return 'seguridad'
  }

  if (normalizedEmail.includes('acis')) {
    return 'acis'
  }

  return 'viewer'
}

const getPermissionsForRole = (role) => ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.viewer

const upsertUserFromGoogle = (email, name, picture) => {
  const store = loadStore()
  const normalizedEmail = String(email || '').toLowerCase()
  let user = store.users.find((entry) => entry.email === normalizedEmail)

  if (!user) {
    const role = determineRoleFromEmail(normalizedEmail)
    user = createUserRecord(normalizedEmail, name, role, 'active')
    user.picture = picture || ''
    store.users.push(user)
  } else {
    user.name = name || user.name
    user.picture = picture || user.picture || ''
    user.role = user.role || determineRoleFromEmail(normalizedEmail)
    user.permissions = getPermissionsForRole(user.role)
    user.updated_at = new Date().toISOString()
  }

  saveStore(store)
  return user
}

const addAuditLog = ({ email, action, module, details = {}, success = true, ipAddress = 'unknown', userAgent = 'system' }) => {
  const store = loadStore()
  const entry = {
    id: `log-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    email: String(email || 'unknown').toLowerCase(),
    action,
    module,
    details,
    success,
    ip_address: ipAddress,
    user_agent: userAgent,
    created_at: new Date().toISOString(),
  }

  store.audit_logs.unshift(entry)
  store.audit_logs = store.audit_logs.slice(0, 200)
  saveStore(store)
  return entry
}

const signToken = (user) => {
  return jwt.sign(
    {
      sub: user.email,
      email: user.email,
      name: user.name,
      role: user.role,
      picture: user.picture || '',
      permissions: user.permissions || getPermissionsForRole(user.role),
      status: user.status || 'active',
    },
    jwtSecret,
    { expiresIn: '12h' },
  )
}

const buildAdminAnalytics = () => {
  const store = loadStore()
  const loginEvents = store.audit_logs.filter((log) => log.action === 'login_success')
  const failedEvents = store.audit_logs.filter((log) => log.action === 'login_failed')
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000

  const usageByDay = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now - ((6 - index) * dayMs))
    const dateKey = date.toISOString().slice(0, 10)
    const dayLogins = loginEvents.filter((entry) => entry.created_at.slice(0, 10) === dateKey)
    const uniqueUsers = new Set(dayLogins.map((entry) => entry.email)).size

    return {
      date: dateKey,
      users: uniqueUsers,
      sessions: dayLogins.length,
    }
  })

  const totalSessions = loginEvents.length
  const activeUsers = store.users.filter((user) => user.status === 'active').length
  const adminUsers = store.users.filter((user) => ['superadmin', 'admin'].includes(user.role)).length
  const errorRate = totalSessions + failedEvents.length === 0
    ? 0
    : Number(((failedEvents.length / (totalSessions + failedEvents.length)) * 100).toFixed(1))
  const performanceScore = Math.max(0, Math.min(100, Math.round(100 - errorRate * 1.8 + Math.min(activeUsers, 12) * 1.2)))

  return {
    summary: {
      totalUsers: store.users.length,
      activeUsers,
      adminUsers,
      totalSessions,
      loginFailureCount: failedEvents.length,
      todayLogins: usageByDay[usageByDay.length - 1]?.sessions || 0,
      errorRate,
      performanceScore,
    },
    usageByDay,
  }
}

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization
  const tokenFromCookie = req.cookies?.portal_session
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : tokenFromCookie

  if (!token) {
    return res.status(401).json({ error: 'No autorizado. Debe iniciar sesión.' })
  }

  try {
    const decoded = jwt.verify(token, jwtSecret)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Sesión inválida o expirada.' })
  }
}

const requireRole = (allowedRoles = []) => (req, res, next) => {
  const userRole = req.user?.role || 'viewer'

  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({ error: 'No tienes permisos para acceder a este recurso.' })
  }

  next()
}

const requirePermission = (permission) => (req, res, next) => {
  const permissions = req.user?.permissions || []

  if (!permissions.includes(permission)) {
    return res.status(403).json({ error: 'No tienes permisos para ejecutar esta acción.' })
  }

  next()
}

app.disable('x-powered-by')
if (isProduction) {
  app.set('trust proxy', 1)
}
app.use(cookieParser())
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        formAction: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'", 'http://localhost:5173'],
      },
    },
    referrerPolicy: { policy: 'no-referrer' },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    noSniff: true,
    xssFilter: true,
    frameguard: { action: 'deny' },
  }),
)

app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  res.setHeader('X-Download-Options', 'noopen')
  next()
})

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error('Origen no permitido por CORS'))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Demasiadas solicitudes, inténtalo más tarde.' },
  }),
)

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos de autenticación, inténtalo más tarde.' },
})

app.use(express.json({ limit: '512kb' }))
app.use(express.urlencoded({ extended: true, limit: '512kb' }))

app.use((req, res, next) => {
  if (req.path.startsWith('/api') && req.headers.authorization && !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autorización inválido' })
  }
  next()
})

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend de Portal Sibate funcionando',
    environment: isProduction ? 'production' : 'development',
    timestamp: new Date().toISOString(),
  })
})

app.get('/api', (req, res) => {
  res.json({
    name: 'portal_sibate_api',
    version: '1.0.0',
    status: 'active',
  })
})

app.post('/api/auth/google', authRateLimit, async (req, res) => {
  const { credential } = req.body || {}

  if (!credential) {
    addAuditLog({ email: 'unknown', action: 'login_failed', module: 'auth', details: { reason: 'No credential' }, success: false })
    return res.status(400).json({ error: 'Falta el token de Google.' })
  }

  if (!googleClientId) {
    addAuditLog({ email: 'unknown', action: 'login_failed', module: 'auth', details: { reason: 'Missing Google Client ID' }, success: false })
    return res.status(500).json({ error: 'Falta la configuración de Google Client ID.' })
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    })

    const payload = ticket.getPayload()

    if (!payload?.email_verified) {
      addAuditLog({ email: String(payload?.email || 'unknown'), action: 'login_failed', module: 'auth', details: { reason: 'Email not verified' }, success: false })
      return res.status(403).json({ error: 'El correo no está verificado.' })
    }

    const email = String(payload.email || '').toLowerCase()
    const domain = email.split('@')[1]?.toLowerCase()

    if (domain !== authorizedDomain) {
      addAuditLog({ email, action: 'login_failed', module: 'auth', details: { reason: 'Unauthorized domain', domain }, success: false })
      return res.status(403).json({ error: `Solo se permite acceso para usuarios del dominio ${authorizedDomain}.` })
    }

    const user = upsertUserFromGoogle(email, payload.name || email, payload.picture || '')
    if (user.status !== 'active') {
      addAuditLog({ email, action: 'login_failed', module: 'auth', details: { reason: 'User inactive' }, success: false })
      return res.status(403).json({ error: 'Este usuario no está habilitado para acceder al portal.' })
    }

    const signedUser = {
      ...user,
      permissions: getPermissionsForRole(user.role),
      picture: payload.picture || user.picture || '',
    }

    const token = signToken(signedUser)

    res.cookie('portal_session', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 12 * 60 * 60 * 1000,
    })

    addAuditLog({
      email,
      action: 'login_success',
      module: 'auth',
      details: { role: signedUser.role },
      success: true,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || 'browser',
    })

    return res.json({
      message: 'Autenticación exitosa',
      user: {
        email: signedUser.email,
        name: signedUser.name,
        role: signedUser.role,
        picture: signedUser.picture,
        permissions: signedUser.permissions,
        status: signedUser.status,
      },
      accessLevel: ROLE_PRIORITY[signedUser.role] > 1 ? 'authorized' : 'limited',
    })
  } catch (error) {
    console.error('Error verificando token de Google:', error)
    addAuditLog({ email: 'unknown', action: 'login_failed', module: 'auth', details: { reason: 'Invalid Google token' }, success: false })
    return res.status(401).json({ error: 'Token de Google inválido.' })
  }
})

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({
    user: {
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      picture: req.user.picture,
      permissions: req.user.permissions || [],
      status: req.user.status || 'active',
    },
  })
})

app.post('/api/auth/logout', (req, res) => {
  const email = req.cookies?.portal_session ? 'user' : 'anonymous'
  addAuditLog({ email, action: 'logout', module: 'auth', details: { message: 'Sesión cerrada' }, success: true })
  res.clearCookie('portal_session')
  return res.json({ success: true, message: 'Sesión cerrada.' })
})

app.get('/api/admin/summary', authMiddleware, requirePermission('view_audit'), (req, res) => {
  const store = loadStore()
  const activeUsers = store.users.filter((user) => user.status === 'active').length
  const roles = Object.keys(ROLE_PRIORITY)

  res.json({
    summary: {
      totalUsers: store.users.length,
      activeUsers,
      totalLogs: store.audit_logs.length,
      roles,
    },
  })
})

app.get('/api/admin/analytics', authMiddleware, requireRole(['superadmin', 'admin']), (req, res) => {
  const analytics = buildAdminAnalytics()
  res.json({ analytics })
})

app.get('/api/admin/users', authMiddleware, requirePermission('manage_users'), (req, res) => {
  const store = loadStore()
  res.json({ users: store.users.map((user) => ({ ...user, permissions: getPermissionsForRole(user.role) })) })
})

app.post('/api/admin/users', authMiddleware, requirePermission('manage_users'), (req, res) => {
  const { email, name, role = 'viewer', status = 'active' } = req.body || {}
  const normalizedEmail = String(email || '').trim().toLowerCase()
  const store = loadStore()

  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    return res.status(400).json({ error: 'Debe ingresar un correo válido.' })
  }

  if (!Object.keys(ROLE_PERMISSIONS).includes(role)) {
    return res.status(400).json({ error: 'Rol no válido.' })
  }

  if (!['active', 'inactive', 'pending'].includes(status)) {
    return res.status(400).json({ error: 'Estado no válido.' })
  }

  if (['admin', 'superadmin'].includes(role) && req.user.role !== 'superadmin') {
    return res.status(403).json({ error: 'Solo un superadministrador puede asignar roles administrativos.' })
  }

  const existingUser = store.users.find((entry) => entry.email === normalizedEmail)
  if (existingUser) {
    return res.status(409).json({ error: 'El usuario ya existe.' })
  }

  const newUser = createUserRecord(normalizedEmail, name || normalizedEmail.split('@')[0], role, status)
  newUser.permissions = getPermissionsForRole(role)
  store.users.push(newUser)
  saveStore(store)

  addAuditLog({
    email: req.user.email,
    action: 'user_created',
    module: 'admin',
    details: { targetUser: normalizedEmail, role, status },
    success: true,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] || 'browser',
  })

  return res.status(201).json({ success: true, user: newUser })
})

app.put('/api/admin/users/:email/role', authMiddleware, requireRole(['superadmin']), (req, res) => {
  const { email } = req.params
  const { role } = req.body || {}
  const normalizedEmail = String(email || '').toLowerCase()
  const allowedRoles = Object.keys(ROLE_PERMISSIONS)

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ error: 'Rol no válido.' })
  }

  const store = loadStore()
  const user = store.users.find((entry) => entry.email === normalizedEmail)

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado.' })
  }

  user.role = role
  user.permissions = getPermissionsForRole(role)
  user.updated_at = new Date().toISOString()
  saveStore(store)

  addAuditLog({
    email: req.user.email,
    action: 'role_updated',
    module: 'admin',
    details: { targetUser: normalizedEmail, previousRole: user.role, newRole: role },
    success: true,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] || 'browser',
  })

  return res.json({ success: true, user })
})

app.patch('/api/admin/users/:email/status', authMiddleware, requirePermission('manage_users'), (req, res) => {
  const { email } = req.params
  const { status } = req.body || {}
  const normalizedEmail = String(email || '').toLowerCase()
  const validStatuses = ['active', 'inactive', 'pending']

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Estado no válido.' })
  }

  const store = loadStore()
  const user = store.users.find((entry) => entry.email === normalizedEmail)

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado.' })
  }

  user.status = status
  user.updated_at = new Date().toISOString()
  saveStore(store)

  addAuditLog({
    email: req.user.email,
    action: 'user_status_updated',
    module: 'admin',
    details: { targetUser: normalizedEmail, status },
    success: true,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] || 'browser',
  })

  return res.json({ success: true, user })
})

app.get('/api/admin/audit', authMiddleware, requirePermission('view_audit'), (req, res) => {
  const store = loadStore()
  res.json({ audit_logs: store.audit_logs.slice(0, 50) })
})

app.get('/api/portal/seguridad', authMiddleware, requireRole(['superadmin', 'admin', 'seguridad']), (req, res) => {
  addAuditLog({
    email: req.user.email,
    action: 'module_access',
    module: 'seguridad',
    details: { path: '/api/portal/seguridad' },
    success: true,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] || 'browser',
  })

  res.json({
    status: 'ok',
    module: 'Seguridad',
    user: req.user.email,
    message: 'Acceso permitido a seguridad',
  })
})

app.get('/api/portal/acis', authMiddleware, requireRole(['superadmin', 'admin', 'acis', 'seguridad']), (req, res) => {
  addAuditLog({
    email: req.user.email,
    action: 'module_access',
    module: 'acis',
    details: { path: '/api/portal/acis' },
    success: true,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] || 'browser',
  })

  res.json({
    status: 'ok',
    module: 'ACIs',
    user: req.user.email,
    message: 'Acceso permitido a ACIs',
  })
})

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'JSON inválido' })
  }

  if (err?.message === 'Origen no permitido por CORS') {
    return res.status(403).json({ error: 'Origen no permitido por CORS' })
  }

  console.error('Error no controlado:', err)
  return res.status(500).json({ error: 'Error interno del servidor' })
})

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`)
})

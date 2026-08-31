import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'

const app = express()
const PORT = Number(process.env.PORT) || 3001
const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173').split(',').map((origin) => origin.trim()).filter(Boolean)

app.disable('x-powered-by')
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'", 'http://localhost:5173'],
      },
    },
  }),
)

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

app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend de Portal Sibate funcionando',
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

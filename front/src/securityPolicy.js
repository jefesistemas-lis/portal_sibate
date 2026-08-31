export const informationSecurityMap = {
  public: 1,
  internal: 2,
  confidential: 3,
  restricted: 4,
}

export const roleAccessMap = {
  viewer: 'internal',
  acis: 'confidential',
  seguridad: 'confidential',
  admin: 'restricted',
  superadmin: 'restricted',
}

export const userAccessLevel = 'restricted'

export const getRoleAccessLevel = (role = 'viewer') => roleAccessMap[role] || 'internal'

export const canAccessInformationLevel = (level, role = 'viewer') => {
  const normalizedLevel = level ?? 'public'
  const currentAccessLevel = getRoleAccessLevel(role)
  return (informationSecurityMap[normalizedLevel] ?? informationSecurityMap.public) <= (informationSecurityMap[currentAccessLevel] ?? informationSecurityMap.public)
}

export const securityPolicy = {
  appName: 'Portal DPO SIBATE',
  environment: import.meta.env.MODE || 'development',
  roleBasedAccess: {
    public: ['public'],
    internal: ['public', 'internal'],
    confidential: ['public', 'internal', 'confidential'],
    restricted: ['public', 'internal', 'confidential', 'restricted'],
  },
  rules: [
    'Nunca exponer secretos, claves o accesos sensibles en el frontend.',
    'Separar información pública de información técnica y administrativa.',
    'Aplicar cifrado, auditoría y trazabilidad en backend para datos sensibles.',
    'Restringir permisos según rol, necesidad de conocer y nivel de riesgo.',
  ],
}

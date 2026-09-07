# Portal Sibate

## Estructura

- front/: aplicación React + Vite
- back/: API base en Node.js con Express

## Seguridad aplicada

- cabeceras de seguridad con Helmet en el backend
- CORS restringido por origen
- rate limiting para prevenir abuso
- validación de JSON y errores controlados
- limite de tamaño de payload
- deshabilitación de `x-powered-by`

## Ejecutar

```bash
cd front
npm install
npm run dev

cd ../back
npm install
npm run dev
```

## Configuracion para produccion

No publiques archivos `.env`, `back/data/portal_store.json`, `node_modules` ni `dist`.
Copia los archivos `.env.example` y define los valores reales en el servidor:

- `APP_ENV=production`
- `CORS_ORIGIN=https://tu-dominio-frontend.com`
- `GOOGLE_CLIENT_ID=...`
- `JWT_SECRET=` una cadena aleatoria de al menos 32 caracteres
- `AUTHORIZED_DOMAIN=lis.com.co`
- `SUPERADMIN_EMAILS=` lista separada por comas de administradores autorizados

El `GOOGLE_CLIENT_ID` puede estar en el frontend porque no es un secreto. El secreto
de Google OAuth, `JWT_SECRET` y cualquier credencial privada deben permanecer solo
en las variables de entorno del servidor.

Antes de publicar, revoca y genera nuevamente cualquier secreto que haya aparecido
en commits anteriores del repositorio.

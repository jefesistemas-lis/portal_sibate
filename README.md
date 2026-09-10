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
- `CORS_ORIGIN=https://dposibate.com.co,https://www.dposibate.com.co`
- `GOOGLE_CLIENT_ID=...`
- `JWT_SECRET=` una cadena aleatoria de al menos 32 caracteres
- `AUTHORIZED_DOMAIN=lis.com.co`
- `SUPERADMIN_EMAILS=` lista separada por comas de administradores autorizados

El `GOOGLE_CLIENT_ID` puede estar en el frontend porque no es un secreto. El secreto
de Google OAuth, `JWT_SECRET` y cualquier credencial privada deben permanecer solo
en las variables de entorno del servidor.

Antes de publicar, revoca y genera nuevamente cualquier secreto que haya aparecido
en commits anteriores del repositorio.

### Hostinger Node.js

En la aplicacion Node.js de Hostinger configura:

- Directorio de aplicacion: `back`
- Archivo de inicio: `server.js`
- Comando de inicio: `npm start`
- Version de Node: 20 o superior

En las variables de entorno de Hostinger agrega estos valores reales:

```text
APP_ENV=production
NODE_ENV=production
CORS_ORIGIN=https://dposibate.com.co,https://www.dposibate.com.co
GOOGLE_CLIENT_ID=TU_CLIENT_ID_DE_GOOGLE
JWT_SECRET=UNA_CADENA_ALEATORIA_DE_32_O_MAS_CARACTERES
AUTHORIZED_DOMAIN=lis.com.co
SUPERADMIN_EMAILS=jefesistemas@lis.com.co
```

No uses `localhost` en `CORS_ORIGIN` cuando la aplicación esté publicada. El dominio
principal también debe enrutar `/api` al proceso Node de Hostinger; si
`https://dposibate.com.co/api/health` devuelve `404`, el backend no está conectado
al dominio aunque la página frontend sí cargue. Revisa los registros de despliegue
de Hostinger: si aparece `GOOGLE_CLIENT_ID es obligatorio` o `JWT_SECRET debe
existir`, falta una variable de entorno.

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

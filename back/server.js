import express from 'express'

const app = express()
const PORT = process.env.PORT || 3001

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend de Portal Sibate funcionando' })
})

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`)
})

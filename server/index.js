import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

const allowedOrigins = (
  process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()).filter(Boolean) ?? [
    'http://localhost:5173',
    'http://localhost:80',
    'http://localhost',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:80',
    'http://127.0.0.1',
  ]
)

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without Origin (curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error('CORS not allowed'))
    },
  })
)
app.use(express.json())

// Routes
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the server!' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
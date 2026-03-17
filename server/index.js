import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

// Routes
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the server!' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
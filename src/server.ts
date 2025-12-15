import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { createServer } from 'http'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'
import taskRoutes from './routes/task.routes'
import userRoutes from './routes/user.routes'
import { setupSocket } from './socket/socket'

dotenv.config()

const app = express()
const httpServer = createServer(app)

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(cookieParser())
app.use(express.json())

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/tasks', taskRoutes)
app.use('/api/v1/users', userRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

const PORT = process.env.PORT || 5000

setupSocket(httpServer)

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


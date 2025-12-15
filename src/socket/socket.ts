import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { verifyToken } from '../config/jwt'

export const setupSocket = (httpServer: HTTPServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true
    }
  })

  io.use((socket, next) => {
    const token = socket.handshake.auth.token || 
                  socket.handshake.headers.authorization?.replace('Bearer ', '') ||
                  socket.handshake.headers.cookie?.split('; ').find((c: string) => c.startsWith('token='))?.split('=')[1]
    
    if (!token) {
      return next(new Error('Authentication required'))
    }

    try {
      const user = verifyToken(token)
      socket.data.user = user
      next()
    } catch (error) {
      next(new Error('Invalid token'))
    }
  })

  io.on('connection', (socket) => {
    socket.join(`user:${socket.data.user.id}`)

    socket.on('task:update', async (data) => {
      socket.broadcast.emit('task:updated', data)
    })

    socket.on('task:assign', async (data) => {
      if (data.assignedToId) {
        io.to(`user:${data.assignedToId}`).emit('task:assigned', {
          task: data.task,
          assignedBy: socket.data.user
        })
      }
      socket.broadcast.emit('task:updated', data)
    })

    socket.on('disconnect', () => {
      console.log(`User ${socket.data.user.id} disconnected`)
    })
  })

  return io
}



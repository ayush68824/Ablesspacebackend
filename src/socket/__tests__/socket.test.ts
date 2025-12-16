import { Server as HTTPServer } from 'http'
import { setupSocket } from '../socket'
import { verifyToken } from '../../config/jwt'

jest.mock('../../config/jwt')

describe('Socket Setup', () => {
  let httpServer: HTTPServer

  beforeEach(() => {
    httpServer = new HTTPServer()
  })

  afterEach(() => {
    httpServer.close()
  })

  it('should authenticate socket connection with valid token', (done) => {
    const mockUser = { id: 'user-1', email: 'test@test.com', name: 'Test User' }
    ;(verifyToken as jest.Mock).mockReturnValue(mockUser)

    const io = setupSocket(httpServer)

    io.on('connection', (socket) => {
      expect(socket.data.user).toEqual(mockUser)
      done()
    })

    const client = require('socket.io-client')(
      `http://localhost:${httpServer.listen().address().port}`,
      {
        auth: { token: 'valid-token' }
      }
    )

    client.on('connect', () => {
      client.disconnect()
    })
  })

  it('should reject connection without token', (done) => {
    const io = setupSocket(httpServer)

    io.on('connection_error', (error) => {
      expect(error.message).toBe('Authentication required')
      done()
    })

    const client = require('socket.io-client')(
      `http://localhost:${httpServer.listen().address().port}`,
      { auth: {} }
    )

    client.on('connect_error', () => {
      client.disconnect()
    })
  })
})





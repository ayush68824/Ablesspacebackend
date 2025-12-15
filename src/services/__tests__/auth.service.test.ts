import { authService } from '../auth.service'
import { userRepository } from '../../repositories/user.repository'
import bcrypt from 'bcryptjs'

jest.mock('../../repositories/user.repository')
jest.mock('bcryptjs')

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('register', () => {
    it('should throw error if email already exists', async () => {
      ;(userRepository.findByEmail as jest.Mock).mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com'
      })

      await expect(
        authService.register({
          email: 'test@test.com',
          password: 'password123',
          name: 'Test User'
        })
      ).rejects.toThrow('Email already registered')
    })

    it('should create user with hashed password', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@test.com',
        name: 'Test User',
        createdAt: new Date()
      }

      ;(userRepository.findByEmail as jest.Mock).mockResolvedValue(null)
      ;(bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password')
      ;(userRepository.create as jest.Mock).mockResolvedValue(mockUser)

      const result = await authService.register({
        email: 'test@test.com',
        password: 'password123',
        name: 'Test User'
      })

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10)
      expect(userRepository.create).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'hashed-password',
        name: 'Test User'
      })
      expect(result.user).toEqual(mockUser)
      expect(result.token).toBeDefined()
    })
  })

  describe('login', () => {
    it('should throw error if user not found', async () => {
      ;(userRepository.findByEmail as jest.Mock).mockResolvedValue(null)

      await expect(
        authService.login({
          email: 'test@test.com',
          password: 'password123'
        })
      ).rejects.toThrow('Invalid credentials')
    })

    it('should throw error if password is incorrect', async () => {
      ;(userRepository.findByEmail as jest.Mock).mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        password: 'hashed-password',
        name: 'Test User'
      })
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      await expect(
        authService.login({
          email: 'test@test.com',
          password: 'wrong-password'
        })
      ).rejects.toThrow('Invalid credentials')
    })

    it('should return user and token on successful login', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@test.com',
        password: 'hashed-password',
        name: 'Test User'
      }

      ;(userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

      const result = await authService.login({
        email: 'test@test.com',
        password: 'password123'
      })

      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed-password')
      expect(result.user).toEqual({
        id: 'user-1',
        email: 'test@test.com',
        name: 'Test User'
      })
      expect(result.token).toBeDefined()
    })
  })
})




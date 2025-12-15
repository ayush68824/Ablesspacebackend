import { Response } from 'express'
import { AuthRequest } from '../types'
import { authService } from '../services/auth.service'
import { userRepository } from '../repositories/user.repository'

export const authController = {
  register: async (req: AuthRequest, res: Response) => {
    try {
      const { user, token } = await authService.register(req.body)
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      res.status(201).json({ user, token })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  login: async (req: AuthRequest, res: Response) => {
    try {
      const { user, token } = await authService.login(req.body)
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      res.json({ user, token })
    } catch (error: any) {
      res.status(401).json({ error: error.message })
    }
  },

  me: async (req: AuthRequest, res: Response) => {
    try {
      const user = await userRepository.findById(req.user!.id)
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }
      res.json({ user })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },

  updateProfile: async (req: AuthRequest, res: Response) => {
    try {
      const user = await userRepository.update(req.user!.id, { name: req.body.name })
      res.json({ user })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  logout: async (req: AuthRequest, res: Response) => {
    res.clearCookie('token')
    res.json({ message: 'Logged out successfully' })
  }
}




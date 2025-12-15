import { RequestHandler, Response, NextFunction } from 'express'
import { verifyToken } from '../config/jwt'
import { AuthRequest } from '../types'

export const authenticate: RequestHandler = (req, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest

    const token = authReq.cookies?.token || authReq.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const decoded = verifyToken(token)
    authReq.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}




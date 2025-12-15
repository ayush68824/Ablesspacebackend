import jwt, { SignOptions, Secret } from 'jsonwebtoken'
import { UserPayload } from '../types'

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'fallback-secret'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export const generateToken = (payload: UserPayload): string => {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN as any }
  return jwt.sign(payload, JWT_SECRET, options)
}

export const verifyToken = (token: string): UserPayload => {
  return jwt.verify(token, JWT_SECRET) as UserPayload
}




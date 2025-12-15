import bcrypt from 'bcryptjs'
import { userRepository } from '../repositories/user.repository'
import { RegisterDto, LoginDto } from '../dto/auth.dto'
import { generateToken } from '../config/jwt'

export const authService = {
  register: async (data: RegisterDto) => {
    const existing = await userRepository.findByEmail(data.email)
    if (existing) {
      throw new Error('Email already registered')
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)
    const user = await userRepository.create({ ...data, password: hashedPassword })
    
    const token = generateToken({ id: user.id, email: user.email, name: user.name })
    return { user, token }
  },

  login: async (data: LoginDto) => {
    const user = await userRepository.findByEmail(data.email)
    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isValid = await bcrypt.compare(data.password, user.password)
    if (!isValid) {
      throw new Error('Invalid credentials')
    }

    const token = generateToken({ id: user.id, email: user.email, name: user.name })
    return { user: { id: user.id, email: user.email, name: user.name }, token }
  }
}




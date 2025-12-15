import prisma from '../config/database'
import { RegisterDto } from '../dto/auth.dto'

export const userRepository = {
  findByEmail: async (email: string) => {
    return prisma.user.findUnique({ where: { email } })
  },

  findById: async (id: string) => {
    return prisma.user.findUnique({ 
      where: { id },
      select: { id: true, email: true, name: true, createdAt: true }
    })
  },

  create: async (data: RegisterDto & { password: string }) => {
    return prisma.user.create({
      data,
      select: { id: true, email: true, name: true, createdAt: true }
    })
  },

  update: async (id: string, data: { name?: string }) => {
    return prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, createdAt: true }
    })
  }
}




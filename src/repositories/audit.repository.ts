import prisma from '../config/database'

export const auditRepository = {
  create: async (data: {
    taskId: string
    userId: string
    action: string
    oldValue?: string | null
    newValue?: string | null
  }) => {
    return prisma.auditLog.create({ data })
  },

  findByTask: async (taskId: string) => {
    return prisma.auditLog.findMany({
      where: { taskId },
      include: {
        user: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
  }
}




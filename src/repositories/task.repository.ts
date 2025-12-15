import prisma from '../config/database'
import { Priority, TaskStatus } from '../types'
import { TaskQueryDto } from '../dto/task.dto'

export const taskRepository = {
  findById: async (id: string) => {
    return prisma.task.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } }
      }
    })
  },

  findMany: async (userId: string, filters: TaskQueryDto) => {
    const where: any = {
      OR: [
        { creatorId: userId },
        { assignedToId: userId }
      ]
    }

    if (filters.status) where.status = filters.status
    if (filters.priority) where.priority = filters.priority

    const orderBy: any = {}
    if (filters.sortBy) {
      orderBy[filters.sortBy] = filters.sortOrder || 'asc'
    } else {
      orderBy.dueDate = 'asc'
    }

    return prisma.task.findMany({
      where,
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } }
      },
      orderBy
    })
  },

  findAssigned: async (userId: string) => {
    return prisma.task.findMany({
      where: { assignedToId: userId },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } }
      },
      orderBy: { dueDate: 'asc' }
    })
  },

  findCreated: async (userId: string) => {
    return prisma.task.findMany({
      where: { creatorId: userId },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } }
      },
      orderBy: { dueDate: 'asc' }
    })
  },

  findOverdue: async (userId: string) => {
    return prisma.task.findMany({
      where: {
        OR: [
          { creatorId: userId },
          { assignedToId: userId }
        ],
        dueDate: { lt: new Date() },
        status: { not: TaskStatus.Completed }
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } }
      },
      orderBy: { dueDate: 'asc' }
    })
  },

  create: async (data: {
    title: string
    description?: string
    dueDate: Date
    priority: Priority
    status: TaskStatus
    creatorId: string
    assignedToId?: string
  }) => {
    return prisma.task.create({
      data,
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } }
      }
    })
  },

  update: async (id: string, data: {
    title?: string
    description?: string
    dueDate?: Date
    priority?: Priority
    status?: TaskStatus
    assignedToId?: string | null
  }) => {
    return prisma.task.update({
      where: { id },
      data,
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } }
      }
    })
  },

  delete: async (id: string) => {
    return prisma.task.delete({ where: { id } })
  }
}




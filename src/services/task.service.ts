import { taskRepository } from '../repositories/task.repository'
import { auditRepository } from '../repositories/audit.repository'
import { CreateTaskDto, UpdateTaskDto, TaskQueryDto } from '../dto/task.dto'
import { TaskStatus } from '../types'

const logTaskChange = async (taskId: string, userId: string, field: string, oldValue: any, newValue: any) => {
  await auditRepository.create({
    taskId,
    userId,
    action: `Updated ${field}`,
    oldValue: oldValue ? String(oldValue) : null,
    newValue: newValue ? String(newValue) : null
  })
}

export const taskService = {
  create: async (data: CreateTaskDto, creatorId: string) => {
    const task = await taskRepository.create({
      title: data.title,
      description: data.description,
      dueDate: new Date(data.dueDate),
      priority: data.priority,
      status: data.status || TaskStatus.ToDo,
      creatorId,
      assignedToId: data.assignedToId
    })

    if (task.assignedToId) {
      await auditRepository.create({
        taskId: task.id,
        userId: creatorId,
        action: 'Task assigned',
        newValue: task.assignedToId
      })
    }

    return task
  },

  update: async (data: UpdateTaskDto, userId: string) => {
    const existing = await taskRepository.findById(data.id!)
    if (!existing) {
      throw new Error('Task not found')
    }

    if (existing.creatorId !== userId && existing.assignedToId !== userId) {
      throw new Error('Unauthorized')
    }

    const updates: any = {}
    if (data.title !== undefined && data.title !== existing.title) {
      updates.title = data.title
      await logTaskChange(data.id!, userId, 'title', existing.title, data.title)
    }
    if (data.description !== undefined && data.description !== existing.description) {
      updates.description = data.description
      await logTaskChange(data.id!, userId, 'description', existing.description, data.description)
    }
    if (data.dueDate !== undefined) {
      const newDate = new Date(data.dueDate)
      if (newDate.getTime() !== existing.dueDate.getTime()) {
        updates.dueDate = newDate
        await logTaskChange(data.id!, userId, 'dueDate', existing.dueDate, newDate)
      }
    }
    if (data.priority !== undefined && data.priority !== existing.priority) {
      updates.priority = data.priority
      await logTaskChange(data.id!, userId, 'priority', existing.priority, data.priority)
    }
    if (data.status !== undefined && data.status !== existing.status) {
      updates.status = data.status
      await logTaskChange(data.id!, userId, 'status', existing.status, data.status)
    }
    if (data.assignedToId !== undefined && data.assignedToId !== existing.assignedToId) {
      updates.assignedToId = data.assignedToId || null
      await logTaskChange(data.id!, userId, 'assignedToId', existing.assignedToId, data.assignedToId)
      
      if (data.assignedToId) {
        await auditRepository.create({
          taskId: data.id!,
          userId,
          action: 'Task assigned',
          newValue: data.assignedToId
        })
      }
    }

    if (Object.keys(updates).length === 0) {
      return existing
    }

    return taskRepository.update(data.id!, updates)
  },

  delete: async (id: string, userId: string) => {
    const task = await taskRepository.findById(id)
    if (!task) {
      throw new Error('Task not found')
    }
    if (task.creatorId !== userId) {
      throw new Error('Unauthorized')
    }
    return taskRepository.delete(id)
  },

  getById: async (id: string) => {
    return taskRepository.findById(id)
  },

  getMany: async (userId: string, filters: TaskQueryDto) => {
    return taskRepository.findMany(userId, filters)
  },

  getAssigned: async (userId: string) => {
    return taskRepository.findAssigned(userId)
  },

  getCreated: async (userId: string) => {
    return taskRepository.findCreated(userId)
  },

  getOverdue: async (userId: string) => {
    return taskRepository.findOverdue(userId)
  }
}




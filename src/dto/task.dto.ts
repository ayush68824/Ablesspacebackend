import { z } from 'zod'
import { Priority, TaskStatus } from '../types'

export const createTaskDto = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be max 100 characters'),
  description: z.string().optional(),
  dueDate: z.string().datetime('Invalid date format'),
  priority: z.nativeEnum(Priority),
  status: z.nativeEnum(TaskStatus).optional(),
  assignedToId: z.string().uuid('Invalid user ID').optional()
})

export const updateTaskDto = createTaskDto.partial().extend({
  id: z.string().uuid('Invalid task ID')
})

export const taskQueryDto = z.object({
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(Priority).optional(),
  sortBy: z.enum(['dueDate', 'createdAt', 'priority']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
})

export type CreateTaskDto = z.infer<typeof createTaskDto>
export type UpdateTaskDto = z.infer<typeof updateTaskDto>
export type TaskQueryDto = z.infer<typeof taskQueryDto>





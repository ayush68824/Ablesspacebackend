import { taskService } from '../task.service'
import { taskRepository } from '../../repositories/task.repository'
import { auditRepository } from '../../repositories/audit.repository'
import { TaskStatus, Priority } from '../../types'

jest.mock('../../repositories/task.repository')
jest.mock('../../repositories/audit.repository')

describe('TaskService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a task and log assignment if assignedToId is provided', async () => {
      const mockTask = {
        id: 'task-1',
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(),
        priority: Priority.High,
        status: TaskStatus.ToDo,
        creatorId: 'user-1',
        assignedToId: 'user-2',
        createdAt: new Date(),
        updatedAt: new Date(),
        creator: { id: 'user-1', name: 'Creator', email: 'creator@test.com' },
        assignedTo: { id: 'user-2', name: 'Assignee', email: 'assignee@test.com' }
      }

      ;(taskRepository.create as jest.Mock).mockResolvedValue(mockTask)
      ;(auditRepository.create as jest.Mock).mockResolvedValue({})

      const result = await taskService.create({
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date().toISOString(),
        priority: Priority.High,
        assignedToId: 'user-2'
      }, 'user-1')

      expect(taskRepository.create).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
        dueDate: expect.any(Date),
        priority: Priority.High,
        status: TaskStatus.ToDo,
        creatorId: 'user-1',
        assignedToId: 'user-2'
      })

      expect(auditRepository.create).toHaveBeenCalledWith({
        taskId: 'task-1',
        userId: 'user-1',
        action: 'Task assigned',
        newValue: 'user-2'
      })

      expect(result).toEqual(mockTask)
    })

    it('should create a task without assignment log if assignedToId is not provided', async () => {
      const mockTask = {
        id: 'task-1',
        title: 'Test Task',
        creatorId: 'user-1',
        assignedToId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        creator: { id: 'user-1', name: 'Creator', email: 'creator@test.com' },
        assignedTo: null
      }

      ;(taskRepository.create as jest.Mock).mockResolvedValue(mockTask)

      await taskService.create({
        title: 'Test Task',
        dueDate: new Date().toISOString(),
        priority: Priority.Medium
      }, 'user-1')

      expect(auditRepository.create).not.toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('should throw error if task not found', async () => {
      ;(taskRepository.findById as jest.Mock).mockResolvedValue(null)

      await expect(
        taskService.update({ id: 'invalid-id', title: 'New Title' }, 'user-1')
      ).rejects.toThrow('Task not found')
    })

    it('should throw error if user is not creator or assignee', async () => {
      const mockTask = {
        id: 'task-1',
        creatorId: 'user-1',
        assignedToId: 'user-2',
        title: 'Original Title'
      }

      ;(taskRepository.findById as jest.Mock).mockResolvedValue(mockTask)

      await expect(
        taskService.update({ id: 'task-1', title: 'New Title' }, 'user-3')
      ).rejects.toThrow('Unauthorized')
    })

    it('should update task and log changes', async () => {
      const existingTask = {
        id: 'task-1',
        title: 'Original Title',
        status: TaskStatus.ToDo,
        priority: Priority.Low,
        creatorId: 'user-1',
        assignedToId: null,
        dueDate: new Date('2024-01-01'),
        description: 'Original Description'
      }

      const updatedTask = {
        ...existingTask,
        title: 'Updated Title',
        status: TaskStatus.InProgress
      }

      ;(taskRepository.findById as jest.Mock).mockResolvedValue(existingTask)
      ;(taskRepository.update as jest.Mock).mockResolvedValue(updatedTask)
      ;(auditRepository.create as jest.Mock).mockResolvedValue({})

      const result = await taskService.update({
        id: 'task-1',
        title: 'Updated Title',
        status: TaskStatus.InProgress
      }, 'user-1')

      expect(auditRepository.create).toHaveBeenCalledTimes(2)
      expect(taskRepository.update).toHaveBeenCalledWith('task-1', {
        title: 'Updated Title',
        status: TaskStatus.InProgress
      })
      expect(result).toEqual(updatedTask)
    })
  })
})




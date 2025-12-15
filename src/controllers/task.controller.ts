import { Response } from 'express'
import { AuthRequest } from '../types'
import { taskService } from '../services/task.service'

export const taskController = {
  create: async (req: AuthRequest, res: Response) => {
    try {
      const task = await taskService.create(req.body, req.user!.id)
      res.status(201).json({ task })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  update: async (req: AuthRequest, res: Response) => {
    try {
      const task = await taskService.update({ ...req.body, id: req.params.id }, req.user!.id)
      res.json({ task })
    } catch (error: any) {
      const status = error.message === 'Task not found' ? 404 : 
                    error.message === 'Unauthorized' ? 403 : 400
      res.status(status).json({ error: error.message })
    }
  },

  delete: async (req: AuthRequest, res: Response) => {
    try {
      await taskService.delete(req.params.id, req.user!.id)
      res.json({ message: 'Task deleted successfully' })
    } catch (error: any) {
      const status = error.message === 'Task not found' ? 404 : 
                    error.message === 'Unauthorized' ? 403 : 400
      res.status(status).json({ error: error.message })
    }
  },

  getById: async (req: AuthRequest, res: Response) => {
    try {
      const task = await taskService.getById(req.params.id)
      if (!task) {
        return res.status(404).json({ error: 'Task not found' })
      }
      res.json({ task })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },

  getMany: async (req: AuthRequest, res: Response) => {
    try {
      const tasks = await taskService.getMany(req.user!.id, req.query as any)
      res.json({ tasks })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },

  getAssigned: async (req: AuthRequest, res: Response) => {
    try {
      const tasks = await taskService.getAssigned(req.user!.id)
      res.json({ tasks })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },

  getCreated: async (req: AuthRequest, res: Response) => {
    try {
      const tasks = await taskService.getCreated(req.user!.id)
      res.json({ tasks })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },

  getOverdue: async (req: AuthRequest, res: Response) => {
    try {
      const tasks = await taskService.getOverdue(req.user!.id)
      res.json({ tasks })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}




import { Router } from 'express'
import { taskController } from '../controllers/task.controller'
import { authenticate } from '../middleware/auth'
import { validate, validateQuery } from '../middleware/validation'
import { createTaskDto, updateTaskDto, taskQueryDto } from '../dto/task.dto'

const router = Router()

router.use(authenticate)

router.post('/', validate(createTaskDto), taskController.create)
router.put('/:id', validate(updateTaskDto), taskController.update)
router.delete('/:id', taskController.delete)
router.get('/:id', taskController.getById)
router.get('/', validateQuery(taskQueryDto), taskController.getMany)
router.get('/assigned/me', taskController.getAssigned)
router.get('/created/me', taskController.getCreated)
router.get('/overdue/me', taskController.getOverdue)

export default router




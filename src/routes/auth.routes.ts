import { Router } from 'express'
import { authController } from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validation'
import { registerDto, loginDto } from '../dto/auth.dto'

const router = Router()

router.post('/register', validate(registerDto), authController.register)
router.post('/login', validate(loginDto), authController.login)
router.get('/me', authenticate, authController.me)
router.put('/profile', authenticate, authController.updateProfile)
router.post('/logout', authenticate, authController.logout)

export default router




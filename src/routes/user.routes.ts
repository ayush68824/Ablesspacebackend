import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import prisma from '../config/database'

const router = Router()

router.get('/', authenticate, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' }
    })
    res.json({ users })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router





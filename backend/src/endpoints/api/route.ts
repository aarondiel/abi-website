import { Router } from 'express'
import auth from './auth'
import gbr from './gbr'
import quotes from './quotes'

const router = Router()

router.use('/auth', auth)
router.use('/gbr', gbr)
router.use('/quotes', quotes)

export default router

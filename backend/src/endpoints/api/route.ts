import { Router } from 'express'
import auth from './auth'
import gbr from './gbr'
import quotes from './quotes'
import gallery from './gallery'

const router = Router()

router.use('/auth', auth)
router.use('/gbr', gbr)
router.use('/quotes', quotes)
router.use('/gallery', gallery)

export default router

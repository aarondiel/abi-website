import { Router } from 'express'
import auth from './auth'
import gbr from './gbr'
import quotes from './quotes'
import gallery from './gallery'
import users from '../../models/users'

const router = Router()

router.use('/auth', auth)
router.use('/gbr', gbr)
router.use('/quotes', quotes)
router.use('/gallery', gallery)
router.get('/users', async (_req, res, _next) => {
	const students = await users.find()
		.select([ '-_id', 'name' ])
	
	res.status(200).json(students.map(student => {
		const names = student.name.split(' ')
		return `${names[0]} ${names[names.length - 1]}`
	}))
})

export default router

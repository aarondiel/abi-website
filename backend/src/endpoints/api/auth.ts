import { Router } from 'express'
import users from '../../models/users'

const router = Router()

router.get('/', async (req, res, _next) => {
	const user = await users.findOne({ code: req.cookies.code })
	if (user)
		return res.status(200).json({ authenticated: true })

	return res.status(401).json({ authenticated: false })
})

router.post('/', async (req, res, _next) => {
	const user = await users.findOne({ code: req.body.code })
	if (user)
		return res.status(200).json({ authenticated: true })

	return res.status(401).json({ authenticated: false })
})

export default router

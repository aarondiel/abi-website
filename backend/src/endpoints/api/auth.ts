import type { RequestHandler } from 'express'
import { Router } from 'express'
import users from '../../models/users'

const router = Router()

const checkAuth: RequestHandler = async (req, res, _next) => {
	const user = await users.findOne({ code: req.cookies.code })
	if (user)
		return res.status(200).json({ authenticated: true })

	return res.status(401).json({ authenticated: false })
}

router.get('/', checkAuth)
router.post('/', checkAuth)

export default router

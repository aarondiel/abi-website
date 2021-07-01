import { Router } from 'express'
import users from '../../../models/user.js'
const router = Router();

router.get('/', async (req, res) => {
	console.log(req.cookies)
	const user = await users.findOne({ code: req.cookies.code })
	if (user)
		return res.status(200).json({ authenticated: true })

	return res.status(401).json({ authenticated: false })
})

router.post('/', async (req, res, next) => {
	const user = await users.findOne({ code: req.body.code })
	if (user)
		return res.status(200).json({ authenticated: true })

	return res.status(401).json({ authenticated: false })
})

export default router;

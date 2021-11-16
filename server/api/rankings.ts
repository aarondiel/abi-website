import { Router } from 'express'
import users from '../models/users'
import teachers from '../models/teachers'
import rankings from '../models/rankings'
import { assert_privilege, mongoose_error_handler } from '../lib/middleware'
const route = Router()

route.get('/', async (_req, res, _next) => {
	const query = await rankings.find({})

	if (query === null)
		return res.sendStatus(404)

	res
		.status(200) .send()
})

route.post('/', assert_privilege('admin'), async (req, res, _next) => {
	const suggestions = await Promise.all(req.body?.suggestions?.map(async val => {
		const user_query = await users.findById(val)

		if (user_query !== null)
			return {
				_id: val,
				ref: 'users'
			}

		const teacher_query = await teachers.findById(val)

		if (teacher_query !== null)
			return {
				_id: val,
				ref: 'teachers'
			}

		return res.sendStatus(400)
	}))

	await rankings.create({
		question: req.body?.question,
		suggestions: suggestions,
	})

	res.sendStatus(200)
}, mongoose_error_handler)

export default route

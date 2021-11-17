import { Router } from 'express'
import users from '../models/users'
import teachers from '../models/teachers'
import rankings from '../models/rankings'
import { assert_privilege, mongoose_error_handler } from '../lib/middleware'
const route = Router()

route.get('/', assert_privilege(), async (_req, res, _next) => {
	let query = await rankings.find({}, [ '-votes' ])
		.populate('suggestions._id', [ 'name' ])
	
	if (query === null)
		return res.sendStatus(404)

	// this is probably a very inefficient solution
	query = query.map(ranking => {
		return {
			_id: ranking._id,
			question: ranking.question,
			suggestions: ranking.suggestions.map(v => v._id)
		}
	})

	res
		.status(200)
		.json(query)
})

route.post('/', assert_privilege(), async (req, res, _next) => {
	res.sendStatus(200)
})

route.post('/submit', assert_privilege('admin'), async (req, res, _next) => {
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

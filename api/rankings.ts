import { Router } from 'express'
import users from '@/models/users'
import teachers from '@/models/teachers'
import rankings from '@/models/rankings'
import mongoose from 'mongoose'
import { assert_privilege, mongoose_error_handler } from '@/lib/middleware'
const route = Router()

route.get('/', assert_privilege(), async (_req, res, _next) => {
	let query = await rankings.find({}, [ '-votes' ])
		.populate('suggestions._id', [ 'name' ])
	
	if (query === null)
		return res.sendStatus(404)

	res
		.status(200)
		.json(query)
})

route.post('/', assert_privilege(), async (req, res, _next) => {
	await Promise.all(Object.keys(req.body).map(async key => {
		await rankings.findByIdAndUpdate(
			new mongoose.Types.ObjectId(key),
			{ $pull: { votes: { submitted_by: new mongoose.Types.ObjectId(res.locals.user._id) } } }
		)

		await rankings.findByIdAndUpdate(
			new mongoose.Types.ObjectId(key),
			{ $push: { votes: {
				vote: {
					_id: new mongoose.Types.ObjectId(req.body[key]._id._id),
					ref: req.body[key].ref
				},
				submitted_by: new mongoose.Types.ObjectId(res.locals.user._id)
			} } }
		)
	}))

	res.sendStatus(200)
}, mongoose_error_handler)

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

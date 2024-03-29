import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import users from '@/models/users'
import teachers from '@/models/teachers'
import rankings from '@/models/rankings'
import mongoose from 'mongoose'
import { assert_privilege } from '@/lib/middleware'
const route = Router()

route.get('/', assert_privilege(), async (_req, res, _next) => {
	let query = await rankings.find({}, [ '-votes' ])
		.populate('suggestions._id', [ 'name' ])
	
	if (query === null)
		return res.sendStatus(404)

	return res
		.status(200)
		.json(query)
})

route.get('/evaluation', assert_privilege(), async (_req, res, _next) => {
	if (res.locals.user.privileges.includes('admin')) {
		const query = await rankings.find({}, [ '-_id', 'question', 'votes' ])
			.populate('votes.vote._id', [ '_id', 'name' ])
			.populate('votes.submitted_by', [ '_id', 'name' ])
		
		if (query === null)
			return res.sendStatus(404)

		return res
			.status(200)
			.json(query.map(ranking => {
				return {
					question: ranking.question,
					votes: ranking.votes.map(vote => {
						return {
							vote: vote.vote._id.name,
							submitted_by: vote.submitted_by.name
						}
					})
				}
			}))
	}

	const query = await rankings.find({}, [ '-_id', 'question', 'votes' ])
		.populate('votes.vote._id', [ '_id', 'name' ])
	
	if (query === null)
		return res.sendStatus(404)

	return res
		.status(200)
		.json(query.map(v => {
			return {
				question: v.question,
				votes: v.votes.map(vote => vote.vote._id.name)
			}
		}))
})

route.post('/', assert_privilege(), async (req: Request, res: Response, _next: NextFunction) => {
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

	return res.sendStatus(200)
})

route.post('/submit', assert_privilege('admin'), async (req: Request, res: Response, _next: NextFunction) => {
	const suggestions = await Promise.all(req.body?.suggestions?.map(async (val: string) => {
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
})

export default route

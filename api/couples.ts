import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { couples, couple_questions, couple_votes } from '@/models/couples'
import { Types } from 'mongoose'
import { mongoose_error_handler } from '@/lib/middleware'
import { assert_privilege } from '@/lib/middleware'

const route = Router()

route.get('/evaluation', assert_privilege(), async (_req, res, _next) => {
	const query = await couple_votes.find({})
		.populate('submitted_by', 'name')
		.populate('votes.question', 'question')
		.populate({
			path: 'votes.vote',
			populate: { path: 'person1._id person2._id', select: 'name' }
		})

	if (query === null)
		return res.sendStatus(404)

	const questions = new Map()

	query.forEach(vote => {
		vote.votes.forEach((v: any) => {
			const id = v._id.toString()
			const vote_name = `${ v.vote.person1._id.name } & ${ v.vote.person2._id.name }`

			const question = questions.get(id) ??
				questions.set(id, {
					question: v.question.question,
					votes: { },
					submitted_by: { }
				}).get(id)


			questions.set(id, {
				question: question.question,
				votes: {
					...question.votes,
					[ vote_name ]: (question.votes[vote_name] ?? 0) + 1
				},
				submitted_by: {
					...question.submitted_by,
					[ vote.submitted_by.name ]: vote_name
				}
			})
		})
	})
	
	if (res.locals.user.privileges.includes('admin'))
		return res
			.status(200)
			.json([ ...questions.values() ])

	return res
		.status(200)
		.json([ ...questions.values() ].map(question => {
			return {
				question: question.question,
				votes: question.votes
			}
		}))
})

route.get('/', assert_privilege(), async (_req, res, _next) => {
	const query = await couple_questions.find()
		.populate({
			path: 'suggestions',
			populate: { path: 'person1._id person2._id', select: 'name' }
		})
	
	return res
		.status(200)
		.json(query)
})

route.post('/submit',
	assert_privilege('admin'),
	async (req: Request, res: Response, _next: NextFunction) => {
		if (!(req.body.suggestions instanceof Array))
			throw('suggestions is not an array')

		const suggestions = await Promise.all(req.body.suggestions.map(async (suggestion: any) => {
			const data = {
				person1: {
					_id: new Types.ObjectId(suggestion.person1._id),
					ref: suggestion.person1.ref
				},

				person2: {
					_id: new Types.ObjectId(suggestion.person2._id),
					ref: suggestion.person2.ref
				}
			}

			let couple = await couples.findOne(data)

			if (couple === null)
				couple = await couples.create(data)

			return couple._id
		}))

		await couple_questions.create({
			question: req.body.question,

			suggestions: suggestions
		})

		return res.sendStatus(200)
	},
	mongoose_error_handler
)

route.post('/',
	assert_privilege(),
	async (req: Request, res: Response, _next: NextFunction) => {
		const submitted_by = new Types.ObjectId(res.locals.user._id)

		await couple_votes.updateOne({ submitted_by }, {
			votes: req.body,

			submitted_by
		}, { upsert: true })

		return res.sendStatus(200)
	},
	mongoose_error_handler
)

export default route

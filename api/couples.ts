import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { couples, couples_votes as votes } from '@/models/couples'
import { Types } from 'mongoose'
import { mongoose_error_handler } from '@/lib/middleware'
import { assert_privilege } from '@/lib/middleware'

const route = Router()

route.get('/', assert_privilege(), async (_req, res, _next) => {
	const query = await couples.find()
		.populate('suggestions.person1._id', [ 'name' ])
		.populate('suggestions.person2._id', [ 'name' ])
	
	return res
		.status(200)
		.json(query)
})

route.post('/submit',
	assert_privilege('admin'),
	async (req: Request, res: Response, _next: NextFunction) => {
		await couples.create({
			question: req.body.question,

			suggestions: req.body.suggestions.map((couple: any) => {
				return {
					person1: {
						_id: new Types.ObjectId(couple.person1._id),
						ref: couple.person1.ref
					},

					person2: {
						_id: new Types.ObjectId(couple.person2._id),
						ref: couple.person2.ref
					}
				}
			})
		})

		return res.sendStatus(200)
	},
	mongoose_error_handler
)

route.post('/',
	assert_privilege(),
	async (req: Request, res: Response, _next: NextFunction) => {
		if (!(req.body instanceof Array))
			throw('invalid vote')

		await votes.create({
			vote: req.body.map((v: any) => {
				if (typeof v !== 'string')
					throw('invalid vote')

				return new Types.ObjectId(v)
			}),

			submitted_by: new Types.ObjectId(res.locals.user._id)
		})

		return res.sendStatus(200)
	},
	mongoose_error_handler
)

export default route

import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { Types } from 'mongoose'
import quotes from '@/models/quotes'
import { assert_privilege, mongoose_error_handler } from '@/lib/middleware'

const route = Router()

route.use(assert_privilege())

route.param('quote', async (_req, res, next, value) => {
	let quote

	if (res.locals.user.privileges.includes('admin'))
		quote = await quotes.findById(value)
			.populate('submitted_by')
	else
		quote = await quotes.findById(value, [ '-submitted_by' ])

	if (quote === null)
		return res.sendStatus(404)

	res.locals.quote = quote
	next()
})

route.get('/count', assert_privilege(), async (_req, res, _next) => {
	const count = await quotes.count()

	return res
		.status(200)
		.send(count)
})

route.get('/:quote', (_req, res, _next) => {
	return res
		.status(200)
		.json(res.locals.quote)
})

route.put('/:quote', assert_privilege('admin'), async (req, res, _next) => {
	await quotes.findByIdAndUpdate(
		res.locals.quote.id,
		req.body
	)

	return res.sendStatus(200)
})

route.delete('/:quote', assert_privilege('admin'), async (_req, res, _next) => {
	await quotes.findByIdAndDelete(res.locals.quote.id)

	return res.sendStatus(200)
})

route.get('/', async (req, res, _next) => {
	const limit = parseInt(req.query?.limit?.toString() ?? '3')
	const offset = parseInt(req.query?.offset?.toString() ?? '0')

	if (
		isNaN(limit) ||
		!res.locals.user.privileges.includes('admin') &&
		(limit < 1 || limit > 20)
	)
		return res
			.status(400)
			.send('limit not valid')

	if (isNaN(offset))
		return res
			.status(404)
			.send('offset not valid')

	let query
	if (res.locals.user.privileges.includes('admin'))
		query = await quotes.find({}, [ 'messages', 'submitted_by' ])
			.sort({ createdAt: -1 })
			.skip(offset)
			.limit(limit)
			.populate('submitted_by', [ 'name' ])
	else
		query = await quotes.find({}, [ '-submitted_by' ])
			.sort({ createdAt: -1 })
			.skip(offset)
			.limit(limit)

	if (query === null)
		return res.sendStatus(500)

	if (res.locals.user.privileges.includes('admin'))
		query = query.map(v => {
			return {
				_id: v._id,
				messages: v.messages,
				submitted_by: v.submitted_by.name
			}
		})

	return res
		.status(200)
		.json(query)
})

route.post('/', assert_privilege(), async (req: Request, res: Response, _next: NextFunction) => {
	await quotes.create({
		messages: req.body,
		submitted_by: new Types.ObjectId(res.locals.user._id)
	})

	return res.sendStatus(200)
}, mongoose_error_handler)

route.delete('/:quote', assert_privilege('delete_quotes'), async (_req: Request, res: Response, _next: NextFunction) => {
	await quotes.findByIdAndDelete(res.locals.quote.id)

	return res.sendStatus(204)
}, mongoose_error_handler)

export default route

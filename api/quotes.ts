import { Router } from 'express'
import quotes from '@/models/quotes'
import { assert_privilege, mongoose_error_handler } from '@/lib/middleware'

const route = Router()

route.use(assert_privilege())

route.param('qoute', async (_req, res, next, value) => {
	let quote

	if (res.locals.user.privileges.includes('admin'))
		quote = await quotes.findById(value)
			.populate('submitted_by')
	else
		quote = await quotes.findById(value, [ '-submitted_by' ])

	if (quote === null)
		res.sendStatus(404)

	res.locals.quote = quote
	next()
})

route.get('/:quote', (_req, res, _next) => {
	res
		.status(200)
		.json(res.locals.quote)
})

route.get('/', async (req, res, _next) => {
	const limit = parseInt(req.query?.limit?.toString() ?? '3')
	const offset = parseInt(req.query?.offset?.toString() ?? '0')

	if (limit < 1 || limit > 20 || isNaN(limit))
		return res
			.status(400)
			.send('limit not valid')

	const max_quotes = await quotes.count()

	if (offset > max_quotes || isNaN(offset))
		return res
			.status(404)
			.send('end of quotes')

	let query
	if (res.locals.user.privileges.includes('admin'))
		query = await quotes.find({})
			.sort({ createdAt: -1 })
			.skip(offset)
			.limit(limit)
			.populate('submitted_by')
	else
		query = await quotes.find({}, [ '-submitted_by' ])
			.sort({ createdAt: -1 })
			.skip(offset)
			.limit(limit)

	if (query === null)
		return res.sendStatus(500)

	res
		.status(200)
		.json(query)
})

route.post('/', async (req, res, _next) => {
	await quotes.create({
		messages: req.body.messages,
		submitted_by: res.locals.user.id
	})

	res.sendStatus(200)
}, mongoose_error_handler)

route.delete('/:quote', assert_privilege('delete_quotes'), async (req, res, next) => {
	await quotes.findByIdAndDelete(res.locals.quote.id)

	res.sendStatus(204)
}, mongoose_error_handler)

export default route

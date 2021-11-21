import { Router } from 'express'
import teachers from '@/models/teachers'
import { assert_privilege, mongoose_error_handler } from '@/lib/middleware'

const route = Router()

route.param('id', async (_req, res, next, value) => {
	const teacher = await teachers.findById(value)

	if (teacher === null)
		return res
			.status(404)
			.send('teacher not found')
	
	res.locals.target_teacher = teacher
	next()
})

route.get('/', async (_req, res, _next) => {
	const query = await teachers.find({}, [ 'name' ])

	if (query === null)
		res
			.status(500)
			.send('couldn\'t get teachers')
	
	res
		.status(200)
		.json(query)
})

route.get('/:id', async (_req, res, _next) => {
	res
		.status(200)
		.json(res.locals.target_teacher)
})

route.post('/',
	assert_privilege('create_teachers'),
	async (req, res, _next) => {
		await teachers.create({
			name: req.body.name,
			email: req.body.email,
			subjects: req.body.subjects
		})

		res.sendStatus(200)
	},
	mongoose_error_handler
)

export default route

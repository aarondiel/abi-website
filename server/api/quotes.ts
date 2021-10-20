import { Router } from 'express'

const route = Router()

route.post('/', (req, res, next) => {
	res
		.status(200)
		.json({ message: 'hello from quotes' })
})

route.get('/', (_req, res, _next) => {
	res
		.status(200)
		.json({ message: 'hello from quotes' })
})

export default route

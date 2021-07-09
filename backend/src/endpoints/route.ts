import { Router } from 'express'

const route = Router()

route.get('/', (_req, res, _next) => {
	res.send('test')
})

export default route

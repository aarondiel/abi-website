import express from 'express'
import cookieParser from 'cookie-parser'
import { authenticate } from './lib/middleware'

const app = express()

app.use(
	express.json(),
	express.urlencoded({ extended: false }),
	cookieParser(),
	authenticate
)

app.use('/api/users', require('./api/users'))
app.use('/api/quotes', require('./api/quotes'))
app.use('/api/auth', require('./api/auth'))

app.use('/api', (_req, res, _next) => {
	res
		.status(404)
		.json({ message: 'page not found' })
})

export default {
	path: '/',
	handler: app
}

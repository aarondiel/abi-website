import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { authenticate } from './lib/middleware'

const app = express()

app.use(
	cors(),
	express.json(),
	express.urlencoded({ extended: false }),
	cookieParser(),
	authenticate
)

app.use('/users', require('./api/users'))
app.use('/quotes', require('./api/quotes'))
app.use('/teachers', require('./api/teachers'))
app.use('/rankings', require('./api/rankings'))
app.use('/auth', require('./api/auth'))

app.all('/', (_req, res, _next) => {
	res
		.status(404)
		.send('page not found')
})

export default {
	path: '/api',
	handler: app
}

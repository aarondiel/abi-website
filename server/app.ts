import express from 'express'

const app = express()

app.use(
	express.json(),
	express.urlencoded({ extended: false })
)

app.use('/users', require('./api/users'))
app.use('/quotes', require('./api/quotes'))
app.use('/auth', require('./api/auth'))

app.use((_req, res, _next) => {
	res
		.status(404)
		.json({ message: 'page not found' })
})

export default {
	path: '/api',
	handler: app
}

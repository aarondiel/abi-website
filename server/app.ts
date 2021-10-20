import express from 'express'
import quotes from './api/quotes'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/quotes', quotes)

app.use((_req, res, _next) => {
	res
		.status(404)
		.json({ message: 'page not found' })
})

export default {
	path: '/api',
	handler: app
}

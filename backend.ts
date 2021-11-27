import express from 'express'
import cookieParser from 'cookie-parser'
import { setup as init_mongodb } from '@/lib/mongodb'
import { authenticate } from '@/lib/middleware'

const app = express()
init_mongodb()

app.use(
	express.json(),
	express.urlencoded({ extended: false }),
	cookieParser(),
	authenticate
)

import teachers from '@/api/teachers'
app.use('/api/teachers', teachers)

import users from '@/api/users'
app.use('/api/users', users)

import quotes from '@/api/quotes'
app.use('/api/quotes', quotes)

import rankings from '@/api/rankings'
app.use('/api/rankings', rankings)

import auth from '@/api/auth'
app.use('/api/auth', auth)

import mail from '@/api/mail'
app.use('/api/mail', mail)

import couples from '@/api/couples'
app.use('/api/couples', couples)

import gallery from '@/api/gallery'
app.use('/api/gallery', gallery)

app.all('/api', (_req, res, _next) => {
	res
		.status(404)
		.send('page not found')
})

export const handler = app

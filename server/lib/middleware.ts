import express from 'express'
import type mongoose from 'mongoose'
import { privileges } from '../models/users'
import type { Privilege, User } from '../models/users'
import jwt from 'jsonwebtoken'
import config from '../../config'

export const mongoose_error_handler: express.ErrorRequestHandler = (err: mongoose.Error.ValidationError, _req, res, _next) => {
	if (err.errors === undefined) {
		console.error(err)

		return res
			.sendStatus(500)
	}

	const errors = Object.values(err.errors).map(v => v.message)

	res
		.status(400)
		.json(errors)
}

const authenticate: express.RequestHandler = function (req, res, next) {
	const token = req.headers?.authorization?.replace(/^Bearer /i, '')

	if (token === undefined || token === null)
		return res.sendStatus(401)

	jwt.verify(token, config.jwt.access_token, (err, user) => {
		if (err)
			return res.sendStatus(403)

		res.locals.user = user
		next()
	})
}

export function assert_privilege(privilege?: Privilege) {
	if (privilege === undefined)
		return authenticate

	if (!privileges.includes(privilege))
		throw 'privilege not valid'

	const check: express.RequestHandler = (_req, res: express.Response<any, Record<"user", User>>, next) => {
		if (
			res.locals.user.privileges.includes('admin') ||
			res.locals.user.privileges.includes(privilege)
		)
			next()

		res.sendStatus(403)
	}

	return [
		authenticate,
		check
	]
}

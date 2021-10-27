import express from 'express'
import type mongoose from 'mongoose'
import { privileges } from '../models/users'
import type { Privilege, User } from '../models/users'
import jwt from 'jsonwebtoken'
import config from '../../config'

export const mongoose_error_handler: express.ErrorRequestHandler = (err: mongoose.Error.ValidationError, _req, res, _next) => {
	// use instanceof
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

// provide res.locals with the user by authorizing the jwt token
export const authenticate: express.RequestHandler = async (req, res, next) => {
	const token = req.headers?.authorization?.replace(/^Bearer /i, '') ??
		req.cookies?.token

	if (token === undefined || token === null) {
		res.locals.user.error_code = 401
		next()
	}

	jwt.verify(token, config.jwt.access_token, (err, user) => {
		if (err) {
			res.locals.user.error_code = 403
			next()
		}

		res.locals.user = user
		next()
	})
}

export const assert_privilege = (privilege?: Privilege) => {
	if (privilege !== undefined && !privileges.includes(privilege))
		throw 'privilege not valid'

	const check: express.RequestHandler = (_req, res, next) => {
		if (privilege === undefined) {
			res.sendStatus(res.locals?.user?.error_code ?? 401)
		}

		if (
			res.locals.user.privileges.includes('admin') ||
			res.locals.user.privileges.includes(privilege)
		)
			next()

		res.sendStatus(403)
	}

	return check
}

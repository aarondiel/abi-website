import express from 'express'
import mongoose from 'mongoose'
import { privileges } from '../models/users'
import type { Privilege } from '../models/users'
import jwt from 'jsonwebtoken'
import config from '../../config'

export const mongoose_error_handler: express.ErrorRequestHandler = (err: any, _req, res, _next) => {
	if (err.errors instanceof mongoose.Error.ValidationError) {
		const errors = Object.values(err.errors).map(v => v.message)

		return res
			.status(400)
			.json(errors)
	}

	console.error(err)

	return res
		.sendStatus(500)
}

export const authenticate: express.RequestHandler = async (req, res, next) => {
	const token = req.headers?.authorization?.replace(/^Bearer /i, '') ??
		req.cookies?.token

	res.locals.user = {}

	if (token === undefined || token === null) {
		res.locals.user.error_code = 401
		return next()
	}

	jwt.verify(token, config.jwt.access_token, (err, user) => {
		if (err !== undefined && err !== null) {
			res.locals.user.error_code = 403
			return next()
		}

		res.locals.user = user
		res.locals.user.token = token
		return next()
	})
}

export const assert_privilege = (privilege?: Privilege) => {
	if (privilege !== undefined && !privileges.includes(privilege))
		throw 'privilege not valid'

	const check: express.RequestHandler = (_req, res, next) => {
		if (privilege === undefined && res.locals?.user?.error_code === undefined)
			return next()

		if (privilege === undefined)
			res.sendStatus(res.locals?.user?.error_code ?? 401)

		if (
			res.locals?.user?.privileges?.includes('admin') ||
			res.locals?.user?.privileges?.includes(privilege)
		)
			return next()

		res.sendStatus(403)
	}

	return check
}

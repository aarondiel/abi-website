import express from 'express'
import type mongoose from 'mongoose'
import users, { privileges } from '../models/users'
import type { Privilege } from '../models/users'

export const mongoose_error_handler: express.ErrorRequestHandler = (err: mongoose.Error.ValidationError, _req, res, _next) => {
	if (err.errors === undefined) {
		console.error(err)

		return res
			.status(500)
			.json({ message: 'something went wrong' })
	}

	const errors = Object.values(err.errors).map(v => v.message)

	res
		.status(400)
		.json(errors)
}

// todo: add jwt authentication
export function assert_privilege(privilege: Privilege): express.RequestHandler {
	if (privileges.includes(privilege))
		throw 'privilege not valid'

	return async (req, _res, next) => {
		const code = req.cookies.code ?? req.headers.authorization

		await users.find({ code })

		next()
	}
}

import express from 'express'
import type mongoose from 'mongoose'

export const mongoose_error_handler: express.ErrorRequestHandler = (err: mongoose.Error.ValidationError, _req, res, _next) => {
	const errors = Object.values(err.errors).map(v => v.message)

	res
		.status(400)
		.json(errors)
}


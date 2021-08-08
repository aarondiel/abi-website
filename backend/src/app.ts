import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import config from './config'
import endpoints from './endpoints/route'

const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use('/', endpoints)

// error handling
app.use('/', (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
	switch (typeof err) {
		case 'string':
			res.status(400).json({ message: err })
			break

		case 'object':
			if (err.errors === undefined)
				break

			// collect every validation error
			const errors = Object.values(err.errors as mongoose.CastError).map(v => v.message)
			res.status(400).json({ message: errors[0] })
			break

		default:
			res.status(500).json({ message: 'some error accrued' })
			break
	}
})

mongoose.set('runValidators', true)

const mongodb_connect = new Promise<void>((res, rej) => {
	mongoose.connection.once('error', rej)
	mongoose.connection.once('open', res)

	mongoose.connect(
		`${config.mongodb.url}:${config.mongodb.port}/abi`,
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
})

async function main() {
	await mongodb_connect

	app.listen(config.port, () => {
		console.log(`listening on: http://localhost:${config.port}`)
	})
}

main().catch(console.log)

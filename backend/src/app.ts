import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import config from './config'
import endpoints from './endpoints/route'

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/', endpoints)

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

import mongoose from 'mongoose'
import config from '../config'

mongoose.set('runValidators', true)

export default function connect() {
	return new Promise((res, rej) => {
		mongoose.connect(
			`${config.mongodb.url}:${config.mongodb.port}/abi`,
			{ useNewUrlParser: true, useUnifiedTopology: true }
		)

		const connection = mongoose.connection

		connection.on('error', rej)
		connection.once('open', res)
	})
}

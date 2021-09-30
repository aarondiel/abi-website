import mongoose from 'mongoose'
import config from './config'
import gallery from './models/gallery_images'
import { inspect } from 'util'

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
	let query

	switch (process.argv[2]) {
		case 'gallery_info':
			console.log(process.argv[3])
			query = await gallery.findOne({ image: process.argv[3] })
				.populate('submitted_by')
			break
	}

	console.log(inspect(query, false, null, true))
}

main()
	.then(() => process.exit(0))
	.catch(console.log)

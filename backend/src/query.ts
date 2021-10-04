import mongoose from 'mongoose'
import config from './config'
import gallery from './models/gallery_images'
import { inspect } from 'util'
import ffmpeg from 'fluent-ffmpeg'

mongoose.set('runValidators', true)

const mongodb_connect = new Promise<void>((res, rej) => {
	mongoose.connection.once('error', rej)
	mongoose.connection.once('open', res)

	mongoose.connect(
		`${config.mongodb.url}:${config.mongodb.port}/abi`,
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
})

async function gallery_resolution() {
	const images = await gallery.find()

	if (images === null)
		return

	const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db)

	const downloads = images.map(gallery_image => {
		return new Promise((res, rej) => {
			const download_stream = bucket.openDownloadStream(gallery_image.image)

			ffmpeg(download_stream).ffprobe(async (err, data) => {
				if (err)
					rej(err)

				const resolution = [
					data.streams[0]?.width,
					data.streams[0]?.height,
				]

				if (
					resolution[0] === undefined ||
					resolution[1] === undefined
				)
					rej('type conversion on resolution failed')

				let format = ''
				switch (data.format.format_name) {
					case 'jpeg_pipe':
						format = 'image/jpeg'
						break

					default:
						rej(`unkown type: ${data.format.format_name}`)
				}

				res(await gallery.updateOne({
					_id: gallery_image._id },
					{ $set: {
						resolution: resolution,
						type: format
					}
				}))
			})
		})
	})

	return await Promise.all(downloads)
}

async function gallery_thumbnails() {
	const images = await gallery.find()
		.limit(1)
		.populate('image')

	if (images === null)
		return

	const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db)

	const downloads = images.map(gallery_image => {
		if (
			gallery_image?.thumbnail300 !== undefined &&
			gallery_image?.thumbnail600 !== undefined
		)
			return

		return new Promise<void>((res, rej) => {
			// @ts-ignore
			const download_stream = bucket.openDownloadStream(gallery_image.image._id)

			ffmpeg(download_stream)
				.on('error', rej)
				.on('end', res)

				.output('./output300.jpg')
				.complexFilter('scale=300:-1')

				.output('./output600.jpg')
				.complexFilter('scale=600:-1')
				.run()
			})
	})

	console.log(await Promise.all(downloads))

}

async function main() {
	await mongodb_connect
	let query

	switch (process.argv[2]) {
		case 'gallery_info':
			query = await gallery.findOne({ image: process.argv[3] })
				.populate('submitted_by')
			break

		case 'gallery_thumbnails':
			query = await gallery_thumbnails()
			break

		case 'gallery_resolution':
			query = await gallery_resolution()
			break
	}

	console.log(inspect(query, false, null, true))
}

main()
	.then(() => process.exit(0))
	.catch(console.error)

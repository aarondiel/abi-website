import mongoose from 'mongoose'
import config from './config'
import gallery from './models/gallery_images'
import { inspect } from 'util'
import ffmpeg from 'fluent-ffmpeg'
import type { GalleryImage } from './models/gallery_images'

mongoose.set('runValidators', true)

const mongodb_connect = new Promise<void>((res, rej) => {
	mongoose.connection.once('open', res)
	mongoose.connection.once('error', rej)

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

	for (const img of images) {
		console.log(await new Promise((res, rej) => {
			const download_stream = bucket.openDownloadStream(img.image)

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

				res(await gallery.updateOne(
					{ _id: img._id },
					{ $set: {
						resolution: resolution,
						type: format
					}
				}))
			})
		}))
	}
}

function scale_down_gallery_image(
	gallery_image: GalleryImage,
	bucket: any,
	scale: 300 | 600
) {
	return new Promise((res, rej) => {
		if (!(bucket instanceof mongoose.mongo.GridFSBucket))
			rej('bucket is not valid')

		if (scale === 300 && gallery_image?.thumbnail300 !== undefined)
			res('scaled down image with width = 300 is already present')

		if (scale === 600 && gallery_image?.thumbnail600 !== undefined)
			res('scaled down image with width = 600 is already present')

		const download_stream = bucket.openDownloadStream(gallery_image.image._id)
		const upload_stream = bucket.openUploadStream(gallery_image.image.filename, { metadata: { from: 'gallery', scale: scale } })

		ffmpeg(download_stream)
			.on('error', err => {
				console.error(err)
				rej(err)
			})
			.on('end', async () => {
				if (scale === 300) {
					await gallery.updateOne(
						{ _id: gallery_image._id },
						{ $set: { thumbnail300: upload_stream.id } }
					)
					res('scaled image to width = 300')
				}

				if (scale === 600) {
					await gallery.updateOne(
						{ _id: gallery_image._id },
						{ $set: { thumbnail600: upload_stream.id } }
					)
					res('scaled image to width = 600')
				}
			})

			.complexFilter('scale=300:-1')
			.format('mjpeg')
			.pipe(upload_stream)
	})
}

async function gallery_thumbnails() {
	const images = await gallery.find()
		.populate('image')

	if (images === null)
		return

	const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db)

	const downloads = images.map(gallery_image => Promise.all([
		scale_down_gallery_image(gallery_image, bucket, 300),
		scale_down_gallery_image(gallery_image, bucket, 600)
	]))

	return await Promise.all(downloads)
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

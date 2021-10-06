import { Router } from 'express'
import Busboy from 'busboy'
import { connection, mongo, Types } from 'mongoose'
import gallery from '../../models/gallery_images'
import users from '../../models/users'
import config from '../../config'
import ffmpeg from 'fluent-ffmpeg'

const router = Router()

interface image_metadata {
	resolution: number[],
	type: string
}

function get_image_metadata(bucket: any, download_id: Types.ObjectId): Promise<image_metadata> | null {
	if (!(bucket instanceof mongo.GridFSBucket))
		return null

	const download_stream = bucket.openDownloadStream(download_id)

	return new Promise((res, rej) => {
		ffmpeg(download_stream).ffprobe(async (err, data) => {
			if (err)
				return rej()

			if (
				data.streams[0]?.width === undefined ||
				data.streams[0]?.height === undefined
			)
				return rej('type conversion on resolution failed')

			const resolution = [
				data.streams[0]?.width,
				data.streams[0]?.height,
			]

			let format = ''
			switch (data.format.format_name) {
				case 'jpeg_pipe':
					format = 'image/jpeg'
					break

				default:
					return rej(`unkown type: ${data.format.format_name}`)
			}

			res({
				resolution: resolution,
				type: format
			})
		})
	})
}

function create_image_thumbnail(
	bucket: any,
	download_id: Types.ObjectId,
	name: string,
	scale: 300 | 600
): Promise<Types.ObjectId> | null {
	if (!(bucket instanceof mongo.GridFSBucket))
		return null

	const download_stream = bucket.openDownloadStream(download_id)
	const upload_stream = bucket.openUploadStream(name, {
		metadata: { from: 'gallery', scale: scale }
	})

	return new Promise((res, rej) => {
		ffmpeg(download_stream)
			.on('error', rej)
			.on('end', () => res(Types.ObjectId(upload_stream.id.toString())))

			.complexFilter(`scale=${scale}:-1`)
			.format('mjpeg')
			.pipe(upload_stream)
	})
}

router.post('/', async (req, res, _next) => {
	const user = await users.findOne({ code: req.cookies.code })

	if (user === null)
		return res.status(400).json({ message: 'invalid code' })

	const busboy = new Busboy({
		preservePath: true,
		headers: req.headers,
		limits: {
			fileSize: 32 * 1024 ** 2 // 32MB
		}
	})

	busboy.on('file', (_fieldname, file, filename, _encoding, _mimetype) => {
		const bucket = new mongo.GridFSBucket(connection.db)
		const upload_stream = bucket.openUploadStream(filename, { metadata: { from: 'gallery' } })

		file.on('end', async () => {
			const image_metadata = await get_image_metadata(
				bucket,
				Types.ObjectId(upload_stream.id.toString())
			)

			if (image_metadata === null)
				return

			const image_thumbnail300 = await create_image_thumbnail(
				bucket,
				Types.ObjectId(upload_stream.id.toString()),
				filename,
				300
			)

			const image_thumbnail600 = await create_image_thumbnail(
				bucket,
				Types.ObjectId(upload_stream.id.toString()),
				filename,
				600
			)

			if (image_thumbnail300 === null || image_thumbnail600 === null)
				return

			gallery.create({
				image: upload_stream.id,
				submitted_by: user.id,
				resolution: image_metadata.resolution,
				type: image_metadata.type,
				thumbnail300: image_thumbnail300,
				thumbnail600: image_thumbnail600
			})
		})

		file.pipe(upload_stream)
	})

	busboy.on('finish', () => {
		res.status(200).send('thank you')
	})

	req.pipe(busboy)
})

router.get('/', async (req, res, _next) => {
	const limit = Math.floor(Number(req.query?.limit?.toString() ?? '10'))
	const offset = Math.floor(Number(req.query?.offset?.toString() ?? '0'))

	const query = await gallery.find()
		.sort({ createdAt: -1 })
		.skip(offset)
		.limit(limit)

	if (query === null) {
		console.log('no images found')
		return res.status(404).json({ message: 'no images found' })
	}

	const images = query.map(image => {
		return { src: `${config.url}/api/gallery/${image.image}` }
	})

	res.status(200).json(images)
})

router.get('/:image', async (req, res, _next) => {
	const resolution = req.query?.resolution?.toString() ?? ''

	const query = await gallery.findOne({ image: req.params.image })

	if (query === null) {
		console.log('no image found')
		return res.status(404).json({ message: 'no image found' })
	}

	let image_id: Types.ObjectId = query.image
	switch (resolution) {
		case '300':
			image_id = query.thumbnail300
			break

		case '600':
			image_id = query.thumbnail600
			break

		default:
			image_id = query.image
	}

	const bucket = new mongo.GridFSBucket(connection.db)
	const download_stream = bucket.openDownloadStream(image_id)
	download_stream.pipe(res)
})

export default router

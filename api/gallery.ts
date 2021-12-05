import { Router } from 'express'
import gallery from '@/models/gallery_images'
import files from '@/models/fs.files'
import { mongo, connection, Types } from 'mongoose'
import { assert_privilege } from '@/lib/middleware'
import Busboy from 'busboy'
import ffmpeg from 'fluent-ffmpeg'
import { PassThrough, Readable } from 'stream'

const route = Router()

function buffer_to_stream(buffer: Buffer) {
	const readable = new Readable()
  readable._read = () => {}
  readable.push(buffer)
  readable.push(null)
  return readable
}

// ffmpeg does not properly save the image resolution to webp files
// until they get their shit together this crude workaround is needed
function convert_file(
	bucket: any,
	download_stream: Readable,
	format: 'image/webp' | 'video/webm',
	filename: string,
	size?: 300 | 600
): Promise<Types.ObjectId> {
	if (!(bucket instanceof mongo.GridFSBucket))
		throw('invalid bucket')

	return new Promise<Types.ObjectId>((res, rej) => {
		const upload_stream = bucket.openUploadStream(filename, { metadata: {
			from: 'gallery',
			format: format
		} })

		upload_stream.on('finish', () => res(upload_stream.id as Types.ObjectId))

		if (format === 'video/webm') {
			ffmpeg(download_stream)
				.on('error', rej)
				.on('finish', () => res(upload_stream.id as Types.ObjectId))
				.toFormat('webm')
				.pipe(upload_stream)
		} else if (format === 'image/webp') {
			const chunks: Buffer[] = []
			const passtrough = new PassThrough()

			passtrough.on('data', (data: any) => chunks.push(data))
			passtrough.on('error', rej)
			passtrough.on('end', () => {
				const image = Buffer.concat(chunks)

				if(image.slice(4, 8).readUInt32BE(0) !== 0)
					image.copyWithin(4, -4).slice(0, -4)

				const image_stream = buffer_to_stream(image)

				image_stream.pipe(upload_stream)
			})

			if (size !== undefined)
				ffmpeg(download_stream)
					.on('error', rej)
					.withSize(`${ size }x?`)
					.toFormat('webp')
					.pipe(passtrough, { end: true })
			else
				ffmpeg(download_stream)
					.on('error', rej)
					.toFormat('webp')
					.pipe(passtrough, { end: true })
		}
	})
}

route.param('image', async (_req, res, next, value) => {
	if (typeof value !== 'string' || value.length > 24 || value.length < 12)
		return res.sendStatus(400)

	const query = await files.findById(value)

	if (query === null)
		return res.sendStatus(404)

	res.locals.file = {
		id: new Types.ObjectId(value),
		format: query.metadata?.format,
		size: query.length
	}

	return next()
})

route.get('/:image', async (req, res, _next) => {
	const bucket = new mongo.GridFSBucket(connection.db)
	const download_stream = bucket.openDownloadStream(res.locals.file.id)

	if (req.headers.range) {
		const parts = req.headers.range.replace(/bytes=/, '').split('-')
		const start = parseInt(parts[0], 0)
		const end = parts[1] ? parseInt(parts[1], 10) : res.locals.file.size - 1

		res.writeHead(206, {
			'Content-Range': `bytes ${ start }-${ end }/${ res.locals.file.size }`,
			'Accept-Ranges': 'bytes',
			'Content-Length': end - start + 1,
			'Content-Type': res.locals.file.format
		})
	}

	download_stream.pipe(res)
})

route.get('/', assert_privilege(), async (req, res, _next) => {
	const limit = parseInt(req.query.limit?.toString() ?? '')
	const offset = parseInt(req.query.offset?.toString() ?? '')

	if (isNaN(limit))
		return res
			.status(400)
			.send('limit not valid')

	if (isNaN(offset))
		return res
			.status(400)
			.send('offset not valid')

	let query: any = res.locals.user.privileges.includes('admin') ?
		await gallery.find({}, [ 'image', 'thumbnail300', 'thumbnail600', 'format', 'submitted_by' ])
			.sort({ createdAt: -1 })
			.skip(offset)
			.limit(limit)
			.populate('submitted_by', [ 'name' ]) :
		await gallery.find({}, [ 'image', 'thumbnail300', 'thumbnail600', 'format' ])
			.sort({ createdAt: -1 })
			.skip(offset)
			.limit(limit)

	if (res.locals.user.privileges.includes('admin'))
		query = query.map((v: any) => {
			return {
				_id: v._id,
				image: v.image,
				thumbnail300: v.thumbnail300,
				thumbnail600: v.thumbnail600,
				format: v.format,
				submitted_by: v.submitted_by?.name
			}
		})

	if (query === null)
		return res.status(500)

	return res
		.status(200)
		.json(query)
})

route.post('/', assert_privilege(), (req, res, _next) => {
	const busboy = new Busboy({
		preservePath: true,
		headers: req.headers as Busboy.BusboyHeaders,
		limits: {
			fileSize: 32 * 1024 ** 2 // 32MB
		}
	})

	busboy.on('file', async (_fieldname, file, filename, _encoding, mimetype) => {
		let format: 'image/webp' | 'video/webm'
		if (mimetype.startsWith('image'))
			format = 'image/webp'
		else if (mimetype.startsWith('video'))
			format = 'video/webm'
		else
			throw('invalid format')

		const bucket = new mongo.GridFSBucket(connection.db)

		const file_id = await convert_file(
			bucket,
			file,
			format,
			filename
		)

		const resolution: number[] = await new Promise((res, rej) =>
			ffmpeg(bucket.openDownloadStream(file_id)).ffprobe((err, data) => {
				if (err)
					return rej()

				if(
					data.streams[0].width === undefined ||
					data.streams[0].height === undefined
				)
					return

				res([
					data.streams[0].width,
					data.streams[0].height
				])
			}
		))

		const thumbnail600 = resolution[0] <= 600 ? file_id :
			await convert_file(
				bucket,
				bucket.openDownloadStream(file_id),
				format,
				filename,
				600
			)

		const thumbnail300 = resolution[0] <= 300 ? file_id :
			await convert_file(
				bucket,
				bucket.openDownloadStream(file_id),
				format,
				filename,
				300
			)

		await gallery.create({
			image: file_id,
			thumbnail300: thumbnail300,
			thumbnail600: thumbnail600,
			resolution: resolution,
			format: format,
			submitted_by: new Types.ObjectId(res.locals.user._id)
		})
	})

	busboy.on('finish', () => res.status(200).end() )
	req.pipe(busboy)
})

export default route

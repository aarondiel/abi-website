import { Router } from 'express'
import gallery from '@/models/gallery_images'
import files from '@/models/fs.files'
import { mongo, connection, Types } from 'mongoose'
import { assert_privilege } from '@/lib/middleware'
import Busboy from 'busboy'
import ffmpeg from 'fluent-ffmpeg'

const route = Router()

route.param('image', async (_req, res, next, value) => {
	if (typeof value !== 'string' || value.length > 24 || value.length < 12)
		return res.sendStatus(400)

	const query = await files.findById(value)

	if (query === null)
		return res.sendStatus(404)

	res.locals.image = new Types.ObjectId(value)

	return next()
})

route.get('/:image', async (_req, res, _next) => {
	const bucket = new mongo.GridFSBucket(connection.db)
	const download_stream = bucket.openDownloadStream(res.locals.image)

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
		await gallery.find({}, [ 'image', 'thumbnail300', 'thumbnail600', 'submitted_by' ])
			.sort({ createdAt: -1 })
			.skip(offset)
			.limit(limit)
			.populate('submitted_by', [ 'name' ]) :
		await gallery.find({}, [ 'image', 'thumbnail300', 'thumbnail600', 'submitted_by' ])
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
		const bucket = new mongo.GridFSBucket(connection.db)
		const upload_stream = bucket.openUploadStream(filename, { metadata: { from: 'gallery' } })

		let format: 'webp' | 'webm'
		if (mimetype.startsWith('image'))
			format = 'webp'
		else if (mimetype.startsWith('video'))
			format = 'webm'
		else
			throw('invalid format')

		await new Promise((res, rej) =>
			ffmpeg(file)
				.on('error', rej)
				.on('end', res)
				.toFormat(format)
				.pipe(upload_stream)
		)

		const resolution: number[] = await new Promise((res, rej) =>
			ffmpeg(bucket.openDownloadStream(upload_stream.id)).ffprobe((err, data) => {
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

		const thumbnail600 = resolution[0] <= 600 ?
			upload_stream.id :
			await new Promise((res, rej) => {
			const thumbnail_upload_stream = bucket.openUploadStream(filename, { metadata: { from: 'gallery' } })

				ffmpeg(bucket.openDownloadStream(upload_stream.id))
					.on('error', rej)
					.on('end', () => res(thumbnail_upload_stream.id))
					.withSize('600x?')
					.toFormat(format)
					.pipe(thumbnail_upload_stream)
			})

		const thumbnail300 = resolution[0] <= 300 ?
			upload_stream.id :
			await new Promise((res, rej) => {
			const thumbnail_upload_stream = bucket.openUploadStream(filename, { metadata: { from: 'gallery' } })

				ffmpeg(bucket.openDownloadStream(upload_stream.id))
					.on('error', rej)
					.on('end', () => res(thumbnail_upload_stream.id))
					.withSize('300x?')
					.toFormat(format)
					.pipe(thumbnail_upload_stream)
			})

		gallery.create({
			image: upload_stream.id,
			thumbnail300: thumbnail300,
			thumbnail600: thumbnail600,
			resolution: resolution,
			submitted_by: new Types.ObjectId(res.locals.user._id)
		})
	})

	busboy.on('finish', () => {
		res
			.status(200)
			.end()
	})

	req.pipe(busboy)
})

export default route

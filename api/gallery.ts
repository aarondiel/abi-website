import { Router } from 'express'
import gallery from '@/models/gallery_images'
import files from '@/models/fs.files'
import { mongo, connection, Types } from 'mongoose'
import { assert_privilege } from '@/lib/middleware'

const route = Router()

route.param('image', async (_req, res, next, value) => {
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
			.skip(offset)
			.limit(limit)
			.populate('submitted_by', [ 'name' ]) :
		await gallery.find({}, [ 'image', 'thumbnail300', 'thumbnail600', 'submitted_by' ])
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

export default route

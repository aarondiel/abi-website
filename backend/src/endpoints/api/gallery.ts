import { Router } from 'express'
import Busboy from 'busboy'
import { connection, mongo } from 'mongoose'
import gallery from '../../models/gallery_images'
import config from '../../config'

const router = Router()

router.post('/', async (req, res, _next) => {
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
		gallery.create({ image: upload_stream.id, submitted_by: 'testuser1234' })
		file.pipe(upload_stream)
	})

	busboy.on('finish', () => {
		res.status(200).send('thank you')
	})

	req.pipe(busboy)
})

router.get('/', async (_req, res, _next) => {
	const query = await gallery.find()
		.limit(10)

	if (query === null)
		throw 'no images found'

	const images = query.map(image => `${config.url}/api/gallery/${image.image}`)

	res.status(200).json({ images })
})

router.get('/:image', async (req, res, _next) => {
	const query = await gallery.findById(req.params.image)
		.populate('image')

	if (query === null)
		throw 'no image found'

	// @ts-ignore
	const image_id = query.image._id

	const bucket = new mongo.GridFSBucket(connection.db)
	const download_stream = bucket.openDownloadStream(image_id)
	download_stream.pipe(res)
})

export default router

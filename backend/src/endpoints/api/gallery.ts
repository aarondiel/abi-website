import { Router } from 'express'
import Busboy from 'busboy'
import { connection, mongo } from 'mongoose'
import gallery from '../../models/gallery_images'

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
		console.log('finish')
		res.status(200).send('thank you')
	})

	req.pipe(busboy)
})

router.get('/', async (req, res, _next) => {
	const query = await gallery.find()
		.limit(10)
		.populate('image')
		.populate('submitted_by')

	console.log(query)

	res.status(200).send('cum')
})

export default router

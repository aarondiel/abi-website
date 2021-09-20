import { Router } from 'express'
import Busboy from 'busboy'
import { createWriteStream } from 'fs'
import { join, basename } from 'path'

const router = Router()

router.post('/', async (req, res, _next) => {
	const busboy = new Busboy({
		preservePath: true,
		headers: req.headers,
		limits: {
			fileSize: 8 * 1024 ** 2 // 8MB
		}
	})

	busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
		console.log(fieldname, file, filename, encoding, mimetype)

		const local_file = createWriteStream(join(process.cwd(), 'uploads', basename(filename)))
		file.pipe(local_file)
	})

	busboy.on('finish', () => {
		console.log('finish')
		res.status(200).send('thank you')
	})

	req.pipe(busboy)
})

router.get('/', async (req, res, _next) => {
	res.status(200).send('cum')
})

export default router

import express from 'express';
import users from '../models/user.js'
const router = express.Router();
import api from './api/route.js';
import { join } from 'path';
import { history, isFileRequest } from '../lib/html-history-fallback.js'

const distPath = join(process.cwd(), '../frontend/dist')

function hasBlacklistedPath(url) {
	console.log(url)
	for (const path of [ '/api/quotes' ])
		if (url.startsWith(path))
			return true

	return false
}

router.use(async (req, res, next) => {
	if (isFileRequest(req.url))
		return next()

	if (!hasBlacklistedPath(req.url))
		return next()

	console.log("filter")
	console.log(req.cookies)
	console.log(req.cookies.code)
	const user = await users.findOne({ code: req.cookies.code })
	console.log(user)
	if (user)
		return next()

	res.status(401).json({})
})
router.use('/api', api);
router.use('/', history({
	exclusions: [ '/api' ]
}))
router.use('/', express.static(distPath))

export default router;

import { Router, static as staticPath } from 'express';
import { join } from 'path';
import { historyFallback, isFileRequest } from '../lib/html-history-fallback'
import users from '../models/users'

const router = Router();
const distPath = join(process.cwd(), '../frontend/dist')

function hasBlacklistedPath(url: string): Boolean {
	for (const path of [ '/api/quotes' ])
		if (url.startsWith(path))
			return true

	return false
}

// block unauthorized requests
router.use(async (req, res, next) => {
	if (isFileRequest(req.url))
		return next()

	if (!hasBlacklistedPath(req.url))
		return next()

	const user = await users.findOne({ code: req.cookies.code })
	if (user)
		return next()

	res.status(401).json({})
})

router.use('/', historyFallback({
	exclusions: [ '/api' ]
}))

router.use('/', staticPath(distPath))

export default router;

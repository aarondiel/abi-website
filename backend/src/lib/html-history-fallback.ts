import express from 'express'

interface fallback_config {
	index: string,
	exclusions: string[],
	acceptedHeaders: string[],
	acceptFileRequests: boolean
}

// this interface only exists so that tsserver doesn't yell at me
interface fallback_options {
	index?: string,
	exclusions?: string[],
	acceptedHeaders?: string[],
	acceptFileRequests?: boolean
}

export function isFileRequest(path: string) {
	const search = path.split('/')
	const file = search[search.length -1]

	// test if the last index of the url contains a dot
	// if it contains a dot it is considered a file request
	return file.indexOf('.') !== -1
}

export function historyFallback(options?: fallback_options) {
	const config: fallback_config = {
		index: 'index.html',
		exclusions: [],
		acceptedHeaders: [ 'text/html', 'application/xhtml+xml' ],
		acceptFileRequests: false,
		...options
	}

	const middleware: express.RequestHandler = (req, res, next) => {
		if (req.method !== 'GET')
			return next()

		if (!req.accepts(config.acceptedHeaders))
			return next()

		if (isFileRequest(req.url) && !config.acceptFileRequests)
			return next()

		for (const exclusion of config.exclusions) {
			if (req.url.startsWith(exclusion))
				return next()
		};

		res.redirect(`/${config.index}`)
		next()
	}

	return middleware
}

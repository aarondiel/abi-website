import express from 'express'

interface FallbackConfig {
	index: string,
	exclusions: string[],
	acceptedHeaders: string[],
	acceptFileRequests: boolean
}

// this interface only exists so that tsserver doesn't yell at me
type Optional<Type> = {
	[Property in keyof Type]?: Type[Property]
}

export function isFileRequest(path: string) {
	const search = path.split('/')
	const file = search[search.length -1]

	// test if the last index of the url contains a dot
	// if it contains a dot it is considered a file request
	return file.indexOf('.') !== -1
}

export function historyFallback(options?: Optional<FallbackConfig>) {
	const config: FallbackConfig = {
		index: 'index.html',
		exclusions: [],
		acceptedHeaders: [ 'text/html', 'application/xhtml+xml' ],
		acceptFileRequests: false,
		...options
	}

	const middleware: express.RequestHandler = (req, _res, next) => {
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

		req.url = `/${config.index}`
		next()
	}

	return middleware
}

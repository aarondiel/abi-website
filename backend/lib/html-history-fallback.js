function acceptsHeader(accept, acceptedHeaders) {
	if (accept === undefined)
		return false;

	const accepts = accept.split(',');

	// check if any of the accepted headers are in accepts
	for (const header of acceptedHeaders) {
		if (accepts.indexOf(header) !== -1)
			return true;
	};

	return false;
}

export function isFileRequest(path) {
	let search = path.split('/');
	search = search[search.length -1];

	return search.indexOf('.') !== -1;
}

export function history(config) {
	config = {
		index: 'index.html',
		exclusions: [],
		acceptedHeaders: [ 'text/html', 'application/xhtml+xml' ],
		acceptFileRequests: false,
		...config
	};

	return (req, res, next) => {
		if (req.method !== 'GET')
			return next();

		if (!acceptsHeader(req.headers.accept, config.acceptedHeaders))
			return next();

		if (isFileRequest(req.url) && !config.acceptFileRequests)
			return next();

		for (const exclusion of config.exclusions) {
			if (req.url.startsWith(exclusion))
				return next();
		};

		req.url = `/${config.index}`;
		next();
	}
}

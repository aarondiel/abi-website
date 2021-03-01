const mongoose = require('mongoose');
const config = require('../config');

mongoose.set('runValidators', true);

exports.connect = () => {
	return new Promise((resolve, reject) => {
		mongoose.connect(
			`${config.mongodb.url}:${config.mongodb.port}/abi`,
			{ useNewUrlParser: true, useUnifiedTopology: true }
		);

		const connection = mongoose.connection;

		connection.on('error', reject);
		connection.once('open', resolve);
	});
}

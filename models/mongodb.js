import mongoose from 'mongoose';
import config from '../config.js';

mongoose.set('runValidators', true);

export default function connect() {
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

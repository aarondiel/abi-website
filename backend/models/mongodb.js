const mongoose = require('mongoose');

mongoose.set('runValidators', true);

exports.connect = () => {
	return new Promise((resolve, reject) => {
		mongoose.connect('mongodb://localhost/abi-votes', { useNewUrlParser: true, useUnifiedTopology: true });

		const connection = mongoose.connection;

		connection.on('error', reject);
		connection.once('open', resolve);
	});
}

const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},

	email: {
		type: String,
		required: true
	},

	code: {
		type: String,
		required: true
	},

	gbr: {
		type: Boolean,
		required: true
	}
});

module.exports = mongoose.model('users', UserSchema);

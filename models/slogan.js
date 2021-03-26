const mongoose = require('mongoose')

const sloganSchema = new mongoose.Schema({
	key: {
		type: Number,
		get: v => Math.floor(v),
		set: v => Math.floor(v),
		required: true
	},

	title: {
		type: String,
		required: true
	},

	description: {
		type: String,
		required: false,
		default: ''
	}
});

export default mongoose.model('slogan', sloganSchema);

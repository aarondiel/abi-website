const mongoose = require('mongoose');

const gbrVoteSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users',
		required: true
	},

	choice: {
		type: Number,
		required: [true, "bitte wähle eine option"]
	},

	lastChanged: {
		type: Date,
		required: false
	}
});

module.exports = mongoose.model('gbr-votes', gbrVoteSchema);

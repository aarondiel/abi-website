const mongoose = require('mongoose')
const userlist = require('./userlist')

const VoteSchema = new mongoose.Schema({
	userAccessCode: {
		type: String,
		required: [true, 'bitte gib deinen zugriffscode ein'],
		validate: () => {
			return new Promise((res, rej) => {
				if (userlist.check(this.userAccessCode)) {
					res(userlist.check(this.userAccessCode));
				} else {
					rej('invalid access code');
				}
			});
		}
	},

	choice: {
		type: Number,
		required: [true, "bitte wähle eine option"]
	},

	lastChanged: {
		type: Date,
		required: false
	}
})

module.exports = mongoose.model('slogan-votes', VoteSchema);

const mongoose = require('mongoose');
const users = require('./user')

const exclusionsSchema = new mongoose.Schema({
	_id: false,

	prom: {
		type: Boolean,
		required: true
	},

	aftershow: {
		type: Boolean,
		required: true
	},

	prank: {
		type: Boolean,
		required: true
	}
})

const feesSchema = new mongoose.Schema({
	_id: false,

	hoodies: {
		type: Number,
		min: [ 0, 'aufschlag für hoodies zu niedrig' ],
		max: [ 100, 'aufschlag für hoodies zu hoch' ],
		set: v => {
			if (typeof v === Number) {
				return Math.round(v / 10) * 10
			}

			// find a 1 to 3 digit number followed by a %
			let num = v.match(/\d{1,3}(?=%)/);
			if (num === null)
				return null;

			// will round the number to a multiple of tens insted of ones
			// i.e. 69 -> 70, 42 -> 40, 127 -> 130
			num = parseInt(num[0]);
			num = Math.round(num / 10) * 10;
			return num
		},
		required: [ true, 'aufschlag für hoodies ist ungültig']
	},

	tickets: {
		type: Number,
		min: [ 0, 'aufschlag für tickets zu niedrig' ],
		max: [ 100, 'aufschlag für tickets zu hoch' ],
		set: v => {
			if (typeof v === Number) {
				return Math.round(v / 10) * 10
			}

			let num = v.match(/\d{1,3}(?=%)/);
			if (num === null)
				return null;

			// will round the number to a multiple of tens insted of ones
			// i.e. 69 -> 70, 42 -> 40, 127 -> 130
			num = parseInt(num[0]);
			num = Math.round(num / 10) * 10;
			return num
		},
		required: [ true, 'aufschlag für tickets ist ungültig' ]
	},

	paper: {
		type: Number,
		min: [ 0, 'aufschlag für zeitung zu niedrig' ],
		max: [ 100, 'aufschlag für zeitung zu hoch' ],
		set: v => {
			if (typeof v === Number) {
				return Math.round(v / 10) * 10
			}

			let num = v.match(/\d{1,3}(?=%)/);
			if (num === null)
				return null;

			// will round the number to a multiple of tens insted of ones
			// i.e. 69 -> 70, 42 -> 40, 127 -> 130
			num = parseInt(num[0]);
			num = Math.round(num / 10) * 10;
			return num
		},
		required: [ true, 'aufschlag für zeitung ist ungültig' ]
	}
})

const submissionSchema = new mongoose.Schema({
	_id: false,

	hoodiesName: {
		type: Boolean,
		required: true
	},

	paperName: {
		type: Boolean,
		required: true
	},

	votings: {
		type: Boolean,
		required: true
	},

	organisation: {
		type: Boolean,
		required: true
	},

	exclusions: exclusionsSchema,

	fees: feesSchema
})

const gbrVoteSchema = new mongoose.Schema({
	versionKey: false,

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users',
		required: true
	},

	submission: {
		type: submissionSchema,
		required: true
	}
});

module.exports = mongoose.model('gbr-votes', gbrVoteSchema);

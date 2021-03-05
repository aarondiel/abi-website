const mongoose = require('mongoose');
const users = require('./user')

const exclustionSchema = new mongoose.Schema({
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
	hoodies: {
		type: Number,
		min: [0, 'fee for hoodies is to low'],
		max: [100, 'fee for hoodies is to high'],
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
		required: [true, 'fee for hoodies is invalid']
	},

	tickets: {
		type: Number,
		min: [0, 'fee for tickets is too low'],
		max: [100, 'fee for tickets is too high'],
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
		required: [true, 'fee for hoodies is invalid']
	}
})

const submissionSchema = new mongoose.Schema({
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

	exclustion: exclustionSchema,

	fees: feesSchema
})

const gbrVoteSchema = new mongoose.Schema({
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
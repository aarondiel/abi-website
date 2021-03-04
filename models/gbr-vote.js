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

			const re = /\^d{1,3}(?=%)$/;

			let num = re.match(v);
			if (num === null)
				return null;

			// will round the number to a multiple of tens insted of ones
			// i.e. 69 -> 70, 42 -> 40, 127 -> 130
			num = Math.round(num[0] / 10) * 10;
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

			const re = /\^d{1,3}(?=%)$/;

			let num = re.match(v);
			if (num === null)
				return -1;

			// will round the number to a multiple of tens insted of ones
			// i.e. 69 -> 70, 42 -> 40, 127 -> 130
			num = Math.round(num[0] / 10) * 10;
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

	exclustion: {
		type: exclustionSchema,
		required: true
	},

	fees: {
		type: feesSchema,
		required: true
	},
})

const gbrVoteSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users',
		get: v => {
			users.findById(v)
			return v
		},
		set: v => {
			// test if v is a valid objectid
			const re = /^[0-9a-fA-F]{24}$/;
			if (re.test(v))
				return v;

			// assume that v is a validator code
			users.findOne({ code: v }).then(user => {
				if (!data)
					return null;

				return user.id;
			})
		},
		required: true
	},

	submission: {
		type: submissionSchema,
		required: true
	},

	lastChanged: {
		type: Date,
		required: false
	}
});

module.exports = mongoose.model('gbr-votes', gbrVoteSchema);

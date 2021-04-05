import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
	type: {
		type: String,

		validate: [
			(v) => {
				return ['message', 'info'].indexOf(v) !== -1;
			},
			'not a valid message type'
		],

		required: [ true, 'no message type specified' ]
	},

	side: {
		type: String,

		validate: [
			(v) => {
				return ['left', 'right'].indexOf(v) !== -1;
			},
			'not a valid side'
		],

		required: [
			function() {
				// only required if message type is 'message'
				return this.type === 'message';
			},
			'side was not specified'
		]
	},

	name: {
		type: String,

		required: [ function() {
				// only required if message type is 'message'
				return this.type === 'message';
			},
			'name was not specified'
		]
	},

	text: {
		type: String,
		required: [ true, 'no text specefied' ]
	}
});

const quoteSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Types.ObjectId,
			default: mongoose.Types.ObjectId
		},

		submittedBy: {
			type: mongoose.Types.ObjectId,
			required: true
		},

		messages: {
			type: [ messageSchema ],
			required: true,
			validate: [
				v => {
					return v.length > 0;
				},
				'gib mindestens ein zitat an'
			]
		}
	},
	{
		versionKey: false,
		timestamps: true
	}
);

export default mongoose.model('quotes', quoteSchema);

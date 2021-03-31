import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
	{
		_id: false,

		kind: {
			type: String,

			validate: (v) => {
				return ['message', 'info'].indexOf(v) !== -1;
			},

			required: true
		},

		side: {
			type: String,

			validate: (v) => {
				return ['left', 'right'].indexOf(v) !== -1;
			},

			required: function () {
				// only required if message kind is 'message'
				return this.kind === 'message';
			}
		},

		name: {
			type: String,
			required: true
		},

		message: {
			type: String,
			required: true
		}
	},
	{ _id: false }
);

const quoteSchema = new mongoose.Schema(
	{
		_id: mongoose.Types.ObjectId,

		submittedBy: {
			type: mongoose.Types.ObjectId,
			required: true
		},

		messages: [messageSchema]
	},
	{ versionKey: false }
);

export default mongoose.model('quotes', quoteSchema);

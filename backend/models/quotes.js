import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
	type: {
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

		required: function() {
			// only required if message kind is 'message'
			return this.kind === 'message';
		}
	},

	name: {
		type: String,
		required: function() {
			return this.kind === 'message';
		}
	},

	text: {
		type: String,
		required: true
	}
});

const quoteSchema = new mongoose.Schema(
	{
		_id: mongoose.Types.ObjectId,

		submittedBy: {
			type: mongoose.Types.ObjectId,
			required: true
		},

		messages: {
			type: [ messageSchema ],
			required: true
		}
	},
	{ versionKey: false }
);

export default mongoose.model('quotes', quoteSchema);

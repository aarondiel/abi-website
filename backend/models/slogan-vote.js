import mongoose from 'mongoose';

const sloganVoteSchema = new mongoose.Schema({
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

export default mongoose.model('slogan-votes', sloganVoteSchema);

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},

	email: {
		type: String,
		required: true
	},

	code: {
		type: String,
		required: true
	},

	gbr: {
		type: Boolean,
		required: true
	}
});

export default mongoose.model('users', UserSchema);

import mongoose from 'mongoose'

interface UserInput {
	name: string,
	email: string,
	code: string,
	gbr: boolean
}

export type User = UserInput & mongoose.Document

const schema = new mongoose.Schema({
	name: {
		type: String,
		required: [ true, 'name not specified' ]
	},

	email: {
		type: String,
		required: [ true, 'email not specified' ]
	},

	code: {
		type: String,
		required: [ true, 'code not specified' ],
		index: true,
		unique: true,
		alias: '_id'
	},

	gbr: {
		type: Boolean,
		required: false,
		default: false
	}
}, { _id: false })

export default mongoose.model<User>('users', schema)

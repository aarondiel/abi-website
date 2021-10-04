import { Schema, model, Document } from 'mongoose'

export interface User extends Document {
	name: string,
	email: string,
	code: string,
	gbr: string
}

const schema = new Schema<User>({
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
})

export default model<User>('users', schema)

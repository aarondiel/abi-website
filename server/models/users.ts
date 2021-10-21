import { Schema, model } from 'mongoose'
import type { Document } from 'mongoose'

interface UserInput {
	name: string,
	email: string,
	code: string,
	gbr: boolean
}

export type User = UserInput & Document

const schema = new Schema({
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
		required: [ true, 'code not specified' ]
	},

	gbr: {
		type: Boolean,
		required: [ true, 'gbr not specified' ]
	}
})

export default model<User>('users', schema)

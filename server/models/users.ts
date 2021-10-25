import mongoose from 'mongoose'

export const privileges = [
	'admin',
	'create_users',
	'get_users'
] as const

export type Privilege = typeof privileges[number]

interface UserInput {
	name: string,
	email: string,
	code: string,
	gbr: boolean,
	privileges: Privilege[]
}

export type User = UserInput & mongoose.Document

const schema = new mongoose.Schema({
	code: {
		type: String,
		required: [ true, 'code not specified' ],
		index: true,
		unique: true
	},

	name: {
		type: String,
		required: [ true, 'name not specified' ]
	},

	email: {
		type: String,
		validate: [
			function(this: UserInput, v: string) {
				return /^(?!\.)[a-zA-Z0-9!#$%&'*+\-/=?^_`{|}~.]{1,63}(?<!\.|.*\.\.)@[a-zA-Z0-9\-.]{1,63}$/.test(v)
			},
			'email not valid'
		],
		required: [ true, 'email not specified' ]
	},

	gbr: {
		type: Boolean,
		required: false,
		default: false
	},

	privileges: {
		type: [ {
			type: String,
			enum: privileges
		} ],
		required: false,
		default: []
	}
}, { versionKey: false })

export default mongoose.model<User>('users', schema)

import mongoose from 'mongoose'
import { user_teacher_schema } from './rankings'
import { validate_user } from './users'

const couple_schema = new mongoose.Schema({
	person1: {
		type: user_teacher_schema('suggestions.person1'),
		required: [ true, 'person1 not specified' ]
	},

	person2: {
		type: user_teacher_schema('suggestions.person2'),
		required: [ true, 'person2 not specified' ]
	}
}, { versionKey: false })

const schema = new mongoose.Schema({
	question: {
		type: String,
		required: [ true, 'question not specified' ]
	},

	suggestions: {
		type: [ couple_schema ],
		default: [],
		required: false
	}
}, { versionKey: false })

export const couples =  mongoose.model('couples', schema)

export async function validate_couple(v: any): Promise<boolean> {
	if (!(v instanceof mongoose.Types.ObjectId))
		return false

	const user = await couples.findById(v)
	return user !== null
}

const vote_schema = new mongoose.Schema({
	vote: [ {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'couples',
		required: [ true, 'vote not specified' ],
		validate: [ validate_couple, 'vote not valid' ]
	} ],

	submitted_by: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users',
		required: [ true, 'submitted_by not specified' ],
		validate: [ validate_user, 'submitted_by not valid' ]
	}
}, { versionKey: false })

export const couples_votes = mongoose.model('couples_votes', vote_schema)

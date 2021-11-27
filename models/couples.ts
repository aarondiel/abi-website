import mongoose from 'mongoose'
import { user_teacher_schema } from './rankings'
import { validate_user } from './users'

const couple_schema = new mongoose.Schema({
	person1: {
		type: user_teacher_schema('person1'),
		required: [ true, 'person1 not specified' ]
	},

	person2: {
		type: user_teacher_schema('person2'),
		required: [ true, 'person2 not specified' ]
	}
}, { versionKey: false })

export const couples = mongoose.model('couples', couple_schema)

export async function validate_couple(v: any) {
	if (!(v instanceof mongoose.Types.ObjectId))
		return false

	const couple = await couples.findById(v)
	return couple !== null
}

const couple_questions_schema = new mongoose.Schema({
	question: {
		type: String,
		required: [ true, 'question not specified' ]
	},

	suggestions: {
		type: [ {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'couples',
			validate: [
				validate_couple,
				'couple not valid'
			]
		} ],
		default: [],
		required: false
	}
}, { versionKey: false })

export const couple_questions = mongoose.model('couple_questions', couple_questions_schema)

export async function validate_couple_question(v: any) {
	if (!(v instanceof mongoose.Types.ObjectId))
		return false

	const couple_question = await couple_questions.findById(v)
	return couple_question !== null
}

const couple_votes_schema = new mongoose.Schema({
	votes: {
		type: [ {
			question: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'couple_questions',
				validate: [ validate_couple_question, 'question not valid' ],
				required: [ true, 'question not specified' ]
			},
			
			vote: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'couples',
				validate: [ validate_couple, 'question not valid' ],
				required: [ true, 'question not specified' ]
			}
		} ]
	},

	submitted_by: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users',
		validate: [ validate_user, 'submitted_by not valid' ],
		required: [ true, 'submitted_by not specified' ]
	}
}, { versionKey: false })

export const couple_votes = mongoose.model('couple_votes', couple_votes_schema)

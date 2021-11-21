import mongoose from 'mongoose'

export const subjects = [
	'english',
	'geology',
	'latin',
	'math',
	'physics',
	'german',
	'spanish',
	'french',
	'chemistry',
	'music',
	'sport',
	'history',
	'art',
	'religion - katholic',
	'religion - evangelic',
	'religion - ethics',
	'biology',
	'philosophy',
	'computer science',
	'greek',
	'social studies'
]

export interface Teacher extends mongoose.Document {
	name: string,
	shorthand?: string,
	email?: string,
	subjects: string[]
}

const schema = new mongoose.Schema({
	name: {
		type: String,
		required: [ true, 'name not specified' ]
	},

	shorthand: {
		type: String,
		required: false
	},

	email: {
		type: String,
		required: false
	},

	subjects: {
		type: [ {
			type: String,
			enum: subjects
		}	],
		default: [],
		required: false
	}
}, { versionKey: false })

const teachers = mongoose.model<Teacher>('teachers', schema)

export async function validate_teacher(v: mongoose.Types.ObjectId) {
	const teacher = teachers.findById(v)
	return teacher !== null
}

export default teachers

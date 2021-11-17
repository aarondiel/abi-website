import mongoose from 'mongoose'
import { validate_user } from './users'
import { validate_teacher } from './teachers'
import type { User } from './users'

async function validate_vote(v) {
	if (!(v instanceof mongoose.Types.ObjectId))
		return false

	return validate_user(v) || validate_teacher(v)
}

export interface Ranking extends mongoose.Document {
	question: string,
	suggestions: mongoose.PopulatedDoc<User>[],
	votes: {
		vote: mongoose.PopulatedDoc<User>,
		submitted_by: mongoose.PopulatedDoc<User>
	}[]
}

interface UserTeacherInput {
	_id: mongoose.Types.ObjectId,
	ref: 'users' | 'teachers'
}

function user_teacher_schema(stored_at?: string) {
	const ref_path = stored_at === undefined ?
		'ref' : `${ stored_at }.ref`

	return new mongoose.Schema({
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			refPath: ref_path,
			validate: [
				async function(this: UserTeacherInput, v: mongoose.Types.ObjectId) {
					if (this.ref === 'users')
						return validate_user(v)

					if (this.ref === 'teachers')
						return validate_teacher(v)

					return false
				},
				'_id not valid'
			]
		},

		ref: {
			type: String,
			enum: [ 'users', 'teachers' ],
			required: [ true, 'ref not specified' ]
		}
	}, { versionKey: false })
}

const votes_schema = new mongoose.Schema({
	vote: {
		type: user_teacher_schema('votes.vote'),
		required: [ true, 'vote not specified' ]
	},

	submitted_by: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users',
		validate: [ validate_user, 'submitted_by not valid' ],
		required: [ true, 'submitted_by not specified' ]
	}
}, { _id: false, versionKey: false })

const schema = new mongoose.Schema({
	question: {
		type: String,
		required: [ true, 'question not specified' ]
	},

	suggestions: {
		type: [ user_teacher_schema('suggestions') ],
		default: [],
		required: false
	},

	votes: {
		type: [ votes_schema ],
		default: [],
		required: false
	}
}, { versionKey: false })

export default mongoose.model<Ranking>('rankings', schema)

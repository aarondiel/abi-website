import type { User } from './users'
import { Schema, model } from 'mongoose'

function roundToTens(val: any) {
	if (typeof val === 'number')
		return Math.round(val / 10) * 10

	if (typeof val !== 'string')
		return null

	// find a 1 to 3 digit number followed by a %
	const match = val.match(/\d{1,3}(?=%)/)
	if (match === null)
		return null

	// will round the number to a multiple of tens
	// i.e. 69 -> 70, 42 -> 40, 127 -> 130
	let num = parseInt(match[-1])
	num = Math.round(num / 10) * 10
	return num
}

interface Exclusions {
	prom: boolean,
	aftershow: boolean,
	prank: boolean
}

const exclusionsSchema = new Schema<Exclusions>({
	_id: false,

	prom: {
		type: Boolean,
		required: true
	},

	aftershow: {
		type: Boolean,
		required: true
	},

	prank: {
		type: Boolean,
		required: true
	}
})

interface Fees {
	hoodies: number,
	tickets: number,
	paper: number
}

const feesSchema = new Schema<Fees>({
	_id: false,

	hoodies: {
		type: Number,
		min: [ 0, 'aufschlag für hoodies zu niedrig' ],
		max: [ 100, 'aufschlag für hoodies zu hoch' ],
		set: roundToTens,
		required: [ true, 'aufschlag für hoodies ist ungültig']
	},

	tickets: {
		type: Number,
		min: [ 0, 'aufschlag für tickets zu niedrig' ],
		max: [ 100, 'aufschlag für tickets zu hoch' ],
		set: roundToTens,
		required: [ true, 'aufschlag für tickets ist ungültig' ]
	},

	paper: {
		type: Number,
		min: [ 0, 'aufschlag für zeitung zu niedrig' ],
		max: [ 100, 'aufschlag für zeitung zu hoch' ],
		set: roundToTens,
		required: [ true, 'aufschlag für zeitung ist ungültig' ]
	}
})

interface Submission {
	hoodiesName: boolean,
	paperName: boolean,
	votings: boolean,
	organisation: boolean,
	exclusions: Exclusions,
	fees: Fees
}

const submissionSchema = new Schema<Submission>({
	_id: false,

	hoodiesName: {
		type: Boolean,
		required: true
	},

	paperName: {
		type: Boolean,
		required: true
	},

	votings: {
		type: Boolean,
		required: true
	},

	organisation: {
		type: Boolean,
		required: true
	},

	exclusions: exclusionsSchema,

	fees: feesSchema
})

interface VoteSchema {
	user: User,
	submission: Submission
}

const gbrVoteSchema = new Schema<VoteSchema>({
	versionKey: false,

	user: {
		type: Schema.Types.ObjectId,
		ref: 'users',
		required: true
	},

	submission: {
		type: submissionSchema,
		required: true
	}
})

export default model<VoteSchema>('gbr-votes', gbrVoteSchema)

import mongoose from 'mongoose'
import users from './users'
import type { User } from './users'

interface MessageInput {
	type: 'message' | 'info',
	side?: 'left' | 'right',
	name?: string,
	text: string
}

export type Message = MessageInput & mongoose.Document

interface QuoteInput {
	messages: Message[],
	submitted_by: mongoose.PopulatedDoc<User>
}

export type Quote = QuoteInput & mongoose.Document

const message_schema = new mongoose.Schema({
	type: {
		type: String,

		enum: [ 'message', 'info' ],
		
		required: [ true, 'type not specified' ]
	},

	side: {
		type: String,

		enum: [ 'left', 'right' ],

		required: [
			function(this: MessageInput) {
				return this.type === 'message'
			},
			'side not specified'
		]
	},

	name: {
		type: String,
		required: [
			function(this: MessageInput) {
				return this.type === 'message'
			},
			'name not specified'
		]
	},

	text: {
		type: String,
		required: [ true, 'no text specified' ]
	}
})

const schema = new mongoose.Schema({
	messages: {
		type: [ message_schema ],
		validate: [
			function(this: QuoteInput, v: Message[]) {
				return v.length > 0
			},
			'messages not valid'
		],
		required: [ true, 'messages not specified' ]
	},

	submitted_by: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users',
		validate: [
			async function(this: QuoteInput, v: mongoose.Types.ObjectId) {
				const user = await users.findById(v)
				return user !== null
			},
			'submitted_by not valid'
		],
		required: [ true, 'submitted_by not specified' ]
	}
})

export default mongoose.model<Quote>('quotes', schema)

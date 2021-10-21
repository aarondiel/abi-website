import { Schema, model } from 'mongoose'
import type { Document, PopulatedDoc, Types } from 'mongoose'
import type { User } from './users'
import users from './users'

interface MessageInput {
	type: 'message' | 'info',
	side?: 'left' | 'right',
	name: string,
	text: string
}

export type Message = MessageInput & Document

interface QuoteInput {
	messages: Message[],
	submitted_by: PopulatedDoc<User>
}

export type Quote = QuoteInput & Document

const message_schema = new Schema({
	type: {
		type: String,
		
		validate: [
			function(this: MessageInput, v: string) {
				return [ 'message', 'info' ].includes(v)
			},
			'type not valid'
		],

		required: [ true, 'type not specified' ]
	},

	side: {
		type: String,

		validate: [
			function(this: MessageInput, v: string) {
				return [ 'left', 'right' ].includes(v)
			},
			'side not valid'
		],

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

const schema = new Schema({
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
		type: Schema.Types.ObjectId,
		ref: 'users',
		validate: [
			async function(this: QuoteInput,v: Types.ObjectId) {
				const user = await users.findById(v)
				return user !== null
			},
			'submitted_by not valid'
		],
		required: [ true, 'submitted_by not specified' ]
	}
})

export default model('quotes', schema)

import { Schema, Model, model } from 'mongoose'
import './users'

export interface Message {
	type: 'message' | 'info',
	side?: 'left' | 'right',
	name: string,
	text: string
}

const messageSchema = new Schema<Message, Model<Message>, Message>({
	type: {
		type: String,

		validate: [
			function (v: any) {
				return ['message', 'info'].indexOf(v) !== -1
			},
			'not a valid message type'
		],

		required: [ true, 'no message type specified' ]
	},

	side: {
		type: String,

		validate: [
			function (v: any) {
				return ['left', 'right'].indexOf(v) !== -1
			},
			'not a valid side'
		],

		required: [
			function () {
				// only required if message type is 'message'
				// @ts-ignore
				console.log(this)
				// @ts-ignore
				return this.type === 'message'
			},
			'side was not specified'
		]
	},

	name: {
		type: String,

		required: [ function() {
				// only required if message type is 'message'
				// @ts-ignore
				console.log(this)
				// @ts-ignore
				return this.type === 'message'
			},
			'name was not specified'
		]
	},

	text: {
		type: String,
		required: [ true, 'no text specefied' ]
	}
})

export interface Quote {
	submittedBy: Schema.Types.ObjectId,
	messages: Message[]
}

const quoteSchema = new Schema<Quote>(
	{
		submittedBy: {
			type: Schema.Types.ObjectId,
			ref: 'users',
			required: true
		},

		messages: {
			type: [ messageSchema ],
			required: true,
			validate: [
				function (v: any) {
					return v.length > 0
				},
				'gib mindestens ein zitat an'
			]
		}
	},
	{
		versionKey: false,
		timestamps: true
	}
)

export default model<Quote>('quotes', quoteSchema)

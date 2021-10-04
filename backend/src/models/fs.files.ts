import { Schema, model, Types } from 'mongoose'

export interface File extends Document {
	length: number,
	chunkSize: number,
	uploadDate: Date,
	filename: string,
	md5: string,
	metadata?: object
}

const file_schema = new Schema<File>({
	length: {
		type: Number,
		required: true
	},

	chunkSize: {
		type: Number,
		required: true
	},

	uploadDate: {
		type: Date,
		required: true
	},

	filename: {
		type: String,
		required: true
	},

	md5: {
		type: String,
		required: true
	},

	metadata: {
		type: Object,
		required: false
	},
})

export default model<File>('fs.files', file_schema)

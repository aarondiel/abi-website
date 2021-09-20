import { Schema, Model, model } from 'mongoose'

export interface File {
	id: Schema.Types.ObjectId,
	length: number,
	chunkSize: number,
	uploadDate: Schema.Types.Date,
	filename: string,
	md5: string,
	metadata?: object
}

const file_schema = new Schema<File, Model<File>, File>({
	id: {
		type: Schema.Types.ObjectId,
		required: true
	},

	length: {
		type: Number,
		required: true
	},

	chunkSize: {
		type: Number,
		required: true
	},

	uploadDate: {
		type: Schema.Types.Date,
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

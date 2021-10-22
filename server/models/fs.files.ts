// import { Schema, model } from 'mongoose'
import mongoose from 'mongoose'

interface FileInput {
	length: number,
	chunkSize: number,
	uploadDate: Date,
	filename: string,
	md5: string,
	metadata?: object
}

export type File = FileInput & mongoose.Document

const schema = new mongoose.Schema({
	length: {
		type: Number,
		required: [ true, 'length not specified' ]
	},

	chunkSize: {
		type: Number,
		required: [ true, 'chunkSize not specified' ]
	},

	uploadDate: {
		type: Date,
		required: [ true, 'uploadDate not specified' ]
	},

	filename: {
		type: String,
		required: [ true, 'filename not specified' ]
	},

	md5: {
		type: String,
		required: [ true, 'md5 not specified' ]
	},

	metadata: {
		type: Object,
		required: false
	}
})

export default mongoose.model<File>('fs.files', schema)

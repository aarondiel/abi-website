import mongoose from 'mongoose'
import { validate_file } from './fs.files'
import type { File } from './fs.files'
import { validate_user } from './users'
import type { User } from './users'

interface GalleryImageInput {
	image: ReadableStream
	submitted_by: mongoose.Types.ObjectId
}

export interface GalleryImage extends mongoose.Document {
	image: mongoose.PopulatedDoc<File>,
	thumbnail300: mongoose.PopulatedDoc<File>,
	thumbnail600: mongoose.PopulatedDoc<File>,
	submitted_by: mongoose.PopulatedDoc<User>,
	resolution: [ number, number ],
	type: string
}

const schema = new mongoose.Schema({
	image: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'fs.files',
		validate: [ validate_file, 'image not valid' ],
		required: [ true, 'image not specified' ]
	},

	thumbnail300: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'fs.files',
		required: false
	},

	thumbnail600: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'fs.files',
		required: false
	},

	resolution: {
		type: [ Number ],
		required: [ true, 'resolution not specified' ]
	},

	submitted_by: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users',
		validate: [ validate_user, 'submitted_by not valid' ],
		required: [ true, 'user not specified' ]
	}
}, { versionKey: false, timestamps: true })

export default mongoose.model<GalleryImage>('gallery_images', schema)

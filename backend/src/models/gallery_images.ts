import { Schema, model, Types, Document, PopulatedDoc } from 'mongoose'
import type { File } from './fs.files'
import type { User } from './users'
import './fs.files'
import './users'

export interface GalleryImage extends Document {
	image: PopulatedDoc<File & Document>,
	thumbnail300: PopulatedDoc<File & Document>,
	thumbnail600: PopulatedDoc<File & Document>,
	submitted_by: PopulatedDoc<User & Document>
	resolution?: number[]
	type?: string
}

const gallery_schema = new Schema<GalleryImage>({
	image: {
		type: Schema.Types.ObjectId,
		ref: 'fs.files',
		required: true
	},

	thumbnail300: {
		type: Schema.Types.ObjectId,
		ref: 'fs.files',
		required: true
	},

	thumbnail600: {
		type: Schema.Types.ObjectId,
		ref: 'fs.files',
		required: true
	},

	submitted_by: {
		type: Schema.Types.ObjectId,
		ref: 'users',
		required: true
	},

	resolution: {
		type: [ Number ],
		required: false
	},

	type: {
		type: String,
		required: false
	}
}, { versionKey: false, timestamps: true })

export default model<GalleryImage>('gallery_images', gallery_schema)

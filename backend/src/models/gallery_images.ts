import { Schema, Model, model, Types } from 'mongoose'
import './fs.files'
import './users'

export interface GalleryImage {
	_id: Types.ObjectId,
	image: Types.ObjectId,
	thumbnail300: Types.ObjectId,
	thumbnail600: Types.ObjectId,
	submitted_by: Types.ObjectId
	resolution?: number[]
	type?: string
}

const gallery_schema = new Schema<GalleryImage, Model<GalleryImage>, GalleryImage>({
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

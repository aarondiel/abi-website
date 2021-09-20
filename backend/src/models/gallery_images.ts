import { Schema, Model, model } from 'mongoose'
import './fs.files'
import './users'

export interface GalleryImage {
	image: Schema.Types.ObjectId,
	submitted_by: Schema.Types.ObjectId
}

const gallery_schema = new Schema<GalleryImage, Model<GalleryImage>, GalleryImage>({
	image: {
		type: Schema.Types.ObjectId,
		ref: 'fs.files',
		required: true
	},

	submitted_by: {
		type: Schema.Types.ObjectId,
		ref: 'users',
		required: true
	}
})

export default model<GalleryImage>('gallery_images', gallery_schema)

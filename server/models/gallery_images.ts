import mongoose from 'mongoose'
import files from './fs.files'
import type { File } from './fs.files'
import users from './users'
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
		set: function(this: GalleryImageInput, v: any) {
			console.log(this)
			console.log(v)
		},
		validate: [
			async function(this: GalleryImageInput, v: mongoose.Types.ObjectId) {
				const file = await files.findById(v)
				return file !== null
			},
			'image not valid'
		],
		required: [ true, 'image not specified' ]
	},

	submitted_by: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users',
		validate: [
			async function(this: GalleryImageInput, v: mongoose.Types.ObjectId) {
				const user = await users.findById(v)
				return user !== null
			},
			'submitted_by not valid'
		],
		required: [ true, 'user not specified' ]
	}
})

export default mongoose.model<GalleryImage>('gallery_images', schema)

import { defineNuxtConfig } from 'nuxt3'
import { setup } from './server/lib/mongodb'
import backend from './server/app'

export default defineNuxtConfig({
	meta: {
		link: [
			{
				rel: 'icon',
				type: 'image/svg+xml',
				href: 'favicon.svg'
			},
			{
				rel: 'icon',
				type: 'image/png',
				href: 'favicon.png'
			},
			{
				rel: 'icon',
				type: 'image/x-icon',
				href: 'favicon.ico'
			},
		]
	},

	buildModules: [ setup ],

	serverMiddleware: [ backend ]
})

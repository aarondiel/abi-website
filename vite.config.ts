import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mix from 'vite-plugin-mix'
import { resolve } from 'path'
import { port } from './config'

export default defineConfig({
	server: {
		port: port
	},

	resolve: {
		alias: {
			'@': resolve(__dirname, '.')
		}
	},

	plugins: [
		vue(),
		mix({ handler: 'backend.ts' })
	]
})

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mix from 'vite-plugin-mix'
import { resolve } from 'path'
import { port, frontend_config } from './config'

export default defineConfig({
	base: `${ frontend_config.url }/`,

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

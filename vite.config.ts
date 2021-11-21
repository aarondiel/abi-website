import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mix from 'vite-plugin-mix'
import { resolve } from 'path'

export default defineConfig({
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

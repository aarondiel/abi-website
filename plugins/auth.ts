import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(nuxt_app => {
	nuxt_app.provide('token', () => {
		const token = nuxt_app?.ssrContext?.req?.headers?.authorization?.replace(/^Bearer /i, '') ??
			nuxt_app?.ssrContext?.req?.headers?.cookie?.match(/token=([a-zA-Z0-9_.-]+)/)[1]

		return token
	})
})


declare module '#app' {
	interface NuxtApp {
		$token(): string | undefined
	}
}

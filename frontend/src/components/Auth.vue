<template>
	<slot v-if='is_authorized'/>
	<div class='auth' v-else>
		<h2>Autorisierung benötigt</h2>
		<TextInput ref='code_input' @submit='submit_code()'>Zugangscode</TextInput>
		<button @click='submit_code()'>Log In</button>
		<span id='server-response'/>
	</div>
</template>

<script>
import { ref } from 'vue'
import TextInput from '@/components/TextInput.vue'
import { useRoute } from 'vue-router'
import config from '@/config'

export default {
	name: 'Auth',

	components: {
		TextInput
	},

	emits: [
		'authentication'
	],

	setup(props, asdf) {
		const is_authorized = ref(false)
		const code_input = ref()

		async function test_code(code) {
			const response = await fetch(`${config.url}/api/auth`, {
				method: 'POST',
				credentials: 'omit',
				headers: { 'Content-Type': 'application/json' },
				redirect: 'follow',
				body: JSON.stringify({ code })
			})

			const body = await response.json()
			if (body.authenticated) {
				// create a cookie that expires in 6 months
				document.cookie = `code=${code};max-age=${6 * 30 * 24 * 60 * 60};samesite=strict`
				is_authorized.value = body.authenticated
				asdf.emit('authentication')
			}
		}

		async function get_user_priveleges() {
			const response = await fetch(`${config.url}/api/auth`, {
				method: 'GET',
				credentials: 'same-origin',
				headers: { 'Content-Type': 'application/json' },
				redirect: 'follow',
			})

			const body = await response.json()
			is_authorized.value = body.authenticated
		}

		const submit_code = () => test_code(code_input.value.text)

		get_user_priveleges()

		const router = useRoute()
		if (router.query.code)
			test_code(router.query.code)

		return { code_input, is_authorized, submit_code }
	}
}
</script>

<style lang='scss'>
@use '../scss/colors';

.auth {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	align-items: center;

	> button {
		background-color: colors.$light-grey;
		color: colors.$dark-grey;
		border: none;
		box-shadow: 0 2px 2px #000000;
		cursor: pointer;
		border-radius: 0.25rem;
		padding: 1rem;

		&:hover {
			background-color: colors.$secondary;
			color: white;
		}
	}
}
</style>

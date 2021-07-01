<template>
	<slot v-if='isAuthorized'/>
	<div class='auth' v-else>
		<h2>Autorisierung benötigt</h2>
		<TextInput ref='codeInput'>Zugangscode</TextInput>
		<button @click='submitCode()'>Log In</button>
		<span id='server-response'/>
	</div>
</template>

<script>
import { ref } from 'vue'
import TextInput from '../components/TextInput.vue'

export default {
	name: 'Auth',

	components: {
		TextInput
	},

	setup() {
		const isAuthorized = ref(false)
		const codeInput = ref(null)

		async function submitCode() {
			const code = codeInput.value.text

			const response = await fetch(
				'https://abi.aarondiel.com/api/auth',
				{
					method: 'POST',
					mode: 'cors',
					cache: 'no-cache',
					credentials: 'omit',
					headers: { 'Content-Type': 'application/json' },
					redirect: 'follow',
					referrerPolicy: 'no-referrer',
					body: JSON.stringify({ code })
				}
			)

			const body = await response.json()
			if (body.authenticated) {
				document.cookie = `code=${code};max-age=${30 * 24 * 60 * 60};samesite=strict`
				isAuthorized.value = body.authenticated
				console.log('is authorized')
			}
		}

		fetch(
			'https://abi.aarondiel.com/api/auth',
			{
				method: 'GET',
				mode: 'cors',
				cache: 'no-cache',
				credentials: 'same-origin',
				headers: { 'Content-Type': 'application/json' },
				redirect: 'follow',
				referrerPolicy: 'no-referrer'
			}
		).then(async response => {
			const message = await response.json()
			console.log(response)
			console.log(message)
			isAuthorized.value = message.authenticated
		})

		return { codeInput, isAuthorized, submitCode }
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

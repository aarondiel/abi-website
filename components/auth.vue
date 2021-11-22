<script setup lang='ts'>
import { ref, provide } from 'vue'
import { useRoute } from 'vue-router'
import { frontend_config as config } from '@/config'
import Textinput from '@/components/textinput.vue'
import Submitbutton from '@/components/submitbutton.vue'

const is_authenticated = ref(false)
const code = ref(useRoute().query.code?.toString() ?? '')
const user = ref({})
provide('user', user)

async function get_authentication() {
	const response = await fetch(`${ config.url }/api/auth`, {
		credentials: 'include'
	})
	
	if (!response.ok)
		return
	
	const data = await response.json()
	user.value = data
	is_authenticated.value = true
}

async function authenticate() {
	const response = await fetch(`${ config.url }/api/auth`, {
		method: 'POST',
		headers: {
      'Accept': 'application/json',
			'Content-Type': 'application/json'
    },
		body: JSON.stringify({ code: code.value })
	})

	if (response.ok)
		get_authentication()
}

get_authentication()

if (code.value !== '' && !is_authenticated.value)
	authenticate()
</script>

<template>
	<slot v-if='is_authenticated'/>
	<article class='auth' v-else>
		<h1>Authorisierung benötigt</h1>
		<Textinput v-model='code' placeholder='Code eingeben' required/>
		<Submitbutton @click='authenticate' value='Einloggen'/>
	</article>
</template>

<style lang='scss'>
.auth {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;

	> h1 {
		font-size: 2em;
		margin: 0;
	}
}
</style>

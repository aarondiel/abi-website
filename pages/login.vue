<script setup lang='ts'>
import Textinput from '@/components/textinput.vue'
import Submitbutton from '@/components/submitbutton.vue'

const route = useRoute()
const router = useRouter()
const user = inject('user')
const code = ref('')

async function redirect() {
	await router.replace({
		name: route.query?.redirected_from?.toString() ?? 'index'
	})
}

async function authenticate() {
	try {
		const token = await $fetch(
			'http://localhost:3000/api/auth',
			{ method: 'POST', body: { code: code.value } }
		)

		const response = await $fetch(
			'http://localhost:3000/api/auth',
			{ method: 'GET', headers: { authorization: `Bearer ${ token }` } }
		)

		user.value = response
		redirect()	
	} catch {
		console.log('failed')
	}
}

if (user?.value?.error_code === undefined)
	await redirect()
</script>

<template>
	<article class='auth'>
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
			margin: 0;
		}
	}
</style>

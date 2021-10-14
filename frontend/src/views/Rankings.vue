<template>
	<div class='rankings'>
		<form @submit.prevent='submit_vote'>
			<input type='text' name='testfield'/>

			<div>
				<input type='submit' value='abstimmen'/>
			</div>

			<Loading ref='loading'>
				<p>{{ submit_response }}</p>
			</Loading>
		</form>
	</div>
</template>

<script>
import config from '@/config.js'
import { ref } from 'vue'
import Loading from '@/components/Loading.vue'

export default {
	name: 'Rankings',

	components: { Loading },

	setup() {
		const loading = ref()
		const submit_response = ref('') 

		async function submit_vote({ target }) {
			loading.value.set_loading(true)

			const data = new FormData(target)
			const response = await fetch(`${config.url}/api/rankings`, {
				method: 'POST',
				body: data
			})

			loading.value.$el.classList.remove([ 'success', 'failed' ])

			if (response.ok) {
				loading.value.$el.classList.add('success')
				submit_response.value = 'abstimmung gesendet'
			} else {
				loading.value.$el.classList.add('failed')
				submit_response.value = 'irgentwas is schief gelaufen'
			}

			loading.value.set_loading(false)
		}

		async function get_names() {
			const request = await fetch(`${config.url}/api/users`)

			if (request.ok)
				return await request.json()
		}

		return {
			submit_vote,
			submit_response,
			loading
		}
	}
}
</script>

<style lang='scss'>
.rankings {
	width: 100%;
	display: flex;
	box-sizing: border-box;
	align-items: center;
	flex-direction: column;
	padding: 1rem 1rem 0 1rem;
}
</style>

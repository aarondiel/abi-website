<script setup lang='ts'>
import { ref } from 'vue'
import { frontend_config as config } from '@/config'
import Loading from '@/components/loading.vue'
import Dropdown from '@/components/dropdown.vue'
import Submitbutton from '@/components/submitbutton.vue'

const loading = ref(true)
const couples = ref<any[]>([])
const submission = ref<Record<string, any>>({})
const server_response = ref('')

async function get_couples() {
	loading.value = true

	const response = await fetch(`${ config.url }/api/couples`, {
		credentials: 'include'
	})

	if (!response.ok)
		return

	const data = await response.json()

	couples.value = data.map((question: any) => {
		return {
			_id: question._id,
			question: question.question,
			suggestions: question.suggestions.map((v: any) => {
				return {
					person1: v.person1,
					person2: v.person2,

					name: `${ v.person1._id.name } & ${ v.person2._id.name }`
				}
			})
		}
	})

	loading.value = false
}

async function submit() {
	server_response.value = 'loading'

	const response = await fetch(`${ config.url }/api/couples`, {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(Object.keys(submission.value))
	})
	
	server_response.value = response.ok ? 'Danke fürs Abstimmen シ' : 'error'
	window.setTimeout(() => { server_response.value = '' }, 5000)
}

get_couples()
</script>

<template>
	<article class='couples'>
		<Loading :loading='loading'>
			<form @submit.prevent='submit'>
				<fieldset v-for='question in couples' :key='question._id'>
					<h3>{{ question.question }}</h3>
					<Dropdown :items='question.suggestions' keys='name' v-model='submission[question._id]'>
						Antwort auswählen
					</Dropdown>
				</fieldset>

				<Submitbutton value='Abstimmung einsenden'/>


				<Loading :loading='server_response === "loading"'>
					<p
						class='server_response'
						:class='{ accepted: server_response !== "error" }'
					>
						{{ server_response }}
					</p>
				</Loading>
			</form>
		</Loading>
	</article>
</template>

<style lang='scss'>
@use '@/assets/scss/colors.scss';
@use '@/assets/scss/mixins.scss';

.couples {
	> form {
		> fieldset {
			border-width: 3px 0;
			border-style: double;
			border-color: colors.$secondary;

			+ * {
				margin-top: 5rem;
			}

			> .dropdown {
				max-width: 80%;
				margin: 1rem auto 0 auto
			}
		}

		> .submitbutton {
			margin: 1rem auto 0 auto;
		}

		> .server_response {
			@include mixins.server_response;
		}
	}
}
</style>

<script setup lang='ts'>
import { frontend_config as config } from '@/config'
import { ref } from 'vue'
import Loading from '@/components/loading.vue'
import Dropdown from '@/components/dropdown.vue'
import Submitbutton from '@/components/submitbutton.vue'

const loading = ref(true)
const questions = ref<Record<string, any>[]>([])
const submission = ref<Record<string, any>>({})
const server_response = ref('')

async function submit() {
	server_response.value = 'loading'

	const response = await fetch(`${ config.url }/api/couples`, {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(Object.keys(submission.value).map(v => {
			return {
				question: v,
				vote: submission.value[v]._id
			}
		}))
	})
		
	server_response.value = response.ok ? 'Danke fürs Abstimmen シ' : 'error'
	window.setTimeout(() => { server_response.value = '' }, 5000)
}

async function get_questions() {
	const response = await fetch(`${ config.url }/api/couples`, {
		credentials: 'include'
	})

	if (!response.ok)
		return

	const data: any[] = await response.json()

	questions.value = data.map(question => {
		return {
			...question,
			suggestions: question.suggestions.map((suggestion: any) => {
				return {
					...suggestion,
					name: `${ suggestion.person1._id.name } & ${ suggestion.person2._id.name }`
				}
			})
		}
	})

	loading.value = false
}

get_questions()
</script>

<template>
	<article class='couples'>
		<Loading :loading='loading'>
			<form @submit.prevent='submit'>
				<fieldset v-for='question in questions' :key='question._id'>
					<h3>{{ question.question }}</h3>
					<Dropdown :items='question.suggestions' keys='name' v-model='submission[question._id]'>
						Antwort auswählen:
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

.couples {
	> form {
		> fieldset {
			border-width: 3px 0;
			border-style: double;
			border-color: colors.$secondary;

			> .dropdown {
				max-width: 80%;
				margin: 1rem auto 0 auto;
			}
		}
		
		> .submitbutton {
			margin: 1rem auto 0 auto;
		}
	}
}
</style>

<script setup lang='ts'>
import { ref } from 'vue'
import { frontend_config as config } from '@/config'
import SubmitButton from '@/components/submitbutton.vue'
import Dropdown from '@/components/dropdown.vue'

interface Ranking {
	_id: string,
	question: string,
	suggestions: {
		_id: string,
		ref: 'users' | 'teachers'
	}[]
}

const rankings = ref<Ranking[]>([])
const submission = ref<Record<string, any>>({})

async function get_rankings() {
	const response = await fetch(`${ config.url }/api/rankings`, {
		credentials: 'include'
	})

	if (!response.ok)
		return
	
	const data = await response.json()

	rankings.value = data
}

async function submit() {
	const response = await fetch(`${ config.url }/api/rankings`, {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			question: submission.value.question,
			suggestions: [ ...submission.value.suggestions ].map(v => v._id)
		})
	})

	if (!response.ok)
		return
	
	console.log(response)
}

get_rankings()
</script>

<template>
	<article class='rankings'>
		<form @submit.prevent='submit'>
			<fieldset v-for='ranking in rankings' :key='ranking._id'>
				<h2>{{ ranking.question }}</h2>
				<Dropdown
					:items='ranking.suggestions'
					v-model='submission[ranking._id]'
					keys='_id.name'
				>
					Antwort auswählen
				</Dropdown>
			</fieldset>

			<SubmitButton value='Abstimmung einsenden'/>
		</form>
	</article>
</template>

<style lang='scss'>
@use '@/assets/scss/colors.scss';

.rankings {
	> form {
		> .submitbutton {
			margin: 2rem auto 0 auto;
		}

		> fieldset {
			border-width: 3px 0;
			border-style: double;
			border-color: colors.$secondary;

			+ * {
				margin-top: 5rem;
			}

			> .dropdown {
				margin: 1rem auto;
			}

			> h2 {
				font-size: 1.75em;
			}
		}
	}
}
</style>

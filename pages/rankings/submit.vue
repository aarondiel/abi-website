<script setup lang='ts'>
import Searchbox from '@/components/searchbox.vue'
import Textinput from '@/components/textinput.vue'
import Submitbutton from '@/components/submitbutton.vue'
import { ref, inject } from 'vue'
import { frontend_config as config } from '@/config'

interface User {
	_id: string,
	name: string
}

type Teacher = User

interface UserTeacher {
	_id: User | Teacher,
	ref: 'user' | 'teacher'
}

const submission = ref({ question: '', suggestions: new Set() })
const suggestion = ref({})
const user: any = inject('user')
const server_response = ref('')
const items = ref<UserTeacher[]>([])

async function get_suggestions() {
	const response = await Promise.all([
		fetch(`${ config.url }/api/teachers`),

		fetch(`${ config.url }/api/users`, {
			credentials: 'include'
		})
	])

	if (!response.every(v => v.ok))
		return
	
	const [ teachers, users ] = await Promise.all(
		response.map(v => v.json())
	)

	items.value = [
		...users.map((v: User) => {
			return { _id: v, ref: 'users' }
		}),

		...teachers.map((v: Teacher) => {
			return { _id: v, ref: 'teachers' }
		})
	]
}

async function submit() {
	const response = await fetch(`${ config.url }/api/rankings/submit`, {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(submission.value)
	})

	server_response.value = response.ok ? 'accepted' : 'error'
	window.setTimeout(() => { server_response.value = '' }, 5000)
	submission.value.suggestions.clear()
}

get_suggestions()
</script>

<template>
	<article class='rankings-submit' v-if='user?.privileges?.includes("admin")'>
		<form @submit.prevent='submit'>
			<Textinput v-model='submission.question' placeholder='question' required/>

			<span>
				<Searchbox
					placeholder='suggestion'
					keys='_id.name'
					:items='items'
					v-model='suggestion'
					v-if='items.length > 0'
				>
					schüler auswählen:
				</Searchbox>
				<button
					type='button'
					@click='submission.suggestions.add(suggestion)'
				>
					add
				</button>
			</span>

			<Submitbutton value='send submission'/>
		</form>

		<p>{{ submission }}</p>
		<p
			class='server_response'
			:class='{ accepted: server_response === "accepted" }'
		>
			{{ server_response }}
		</p>
	</article>

	<article v-else>
		access denied
	</article>
</template>

<style lang='scss'>
@use '@/assets/scss/mixins.scss';
@use '@/assets/scss/colors.scss';
.rankings-submit {
	> form {
		> .textinput {
			margin: 1rem auto;
		}

		> span {
			display: flex;
			width: 100%;
			gap: 1rem;

			> button {
				display: block;
				color: colors.$white;
				border: none;
				cursor: pointer;

				@include mixins.gold_border;
			}

			> * {
				flex-grow: 1;
			}
		}

		> .submitbutton {
			margin: 1rem auto 0 auto;
		}

		> button {
			@include mixins.gold_border;
			display: block;
			color: colors.$white;
			width: 20rem;
			height: 3rem;
			margin: 1rem auto 0 auto;
			border: none;
			cursor: pointer;
		}
	}

	> .server_response {
		color: colors.$red;
		&.accepted {
			color: colors.$green;
		}
	}
}
</style>

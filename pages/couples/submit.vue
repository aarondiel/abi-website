<script setup lang='ts'>
import Searchbox from '@/components/searchbox.vue'
import Submitbutton from '@/components/submitbutton.vue'
import Textinput from '@/components/textinput.vue'
import Loading from '@/components/loading.vue'
import { frontend_config as config } from '@/config'
import { ref } from 'vue'

interface User {
	_id: string,
	name: string
}

type Teacher = User

const items = ref<any[]>([])
const couple = ref<any[]>([ {}, {} ])
const submission = ref({ question: '', couples: new Set<any>() })
const server_response = ref('')

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
	server_response.value = 'loading'

	const suggestions = [ ...submission.value.couples ].map(couple => {
		return {
			person1: {
				_id: couple[0]._id._id,
				ref: couple[0].ref
			},

			person2: {
				_id: couple[1]._id._id,
				ref: couple[1].ref
			}
		}
	})

	const response = await fetch(`${ config.url }/api/couples/submit`, {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			question: submission.value.question,
			suggestions: suggestions
		})
	})

	server_response.value = response.ok ? 'accepted' : 'error'
	window.setTimeout(() => { server_response.value = '' }, 5000)
}

get_suggestions()
</script>

<template>
	<article class='couples-submit'>
		<Textinput v-model='submission.question'/>

		<span>
			<Searchbox
				placeholder='person 1'
				keys='_id.name'
				:items='items'
				v-model='couple[0]'
				v-if='items.length > 0'
			>
				person auswählen:
			</Searchbox>

			<p>&</p>

			<Searchbox
				placeholder='person 2'
				keys='_id.name'
				:items='items'
				v-model='couple[1]'
				v-if='items.length > 0'
			>
				person auswählen:
			</Searchbox>
		</span>
		<Submitbutton value='add' @click='submission.couples.add([ ...couple ])'/>

		<Submitbutton value='send' @click='submit'/>

		<p>{{ submission }}</p>

		<Loading :loading='server_response === "loading"'>
			<p
				class='server_response'
				:class='{ accepted: server_response === "accepted" }'
			>
				{{ server_response }}
			</p>
		</Loading>
	</article>
</template>

<style lang='scss'>
@use '@/assets/scss/colors.scss';

.couples-submit {
	> .textinput {
		margin: 0 auto;
	}

	> span {
		margin-top: 1rem;
		width: 100%;
		display: block;
		display: flex;
		justify-content: space-evenly;
	}

	> .submitbutton {
		margin: 1rem auto 0 auto;
	}

	> .server_response {
		color: colors.$red;

		&.accepted {
			color: colors.$green;
		}
	}
}
</style>

<script setup lang='ts'>
import Searchbox from '@/components/searchbox.vue'
import Submitbutton from '@/components/submitbutton.vue'
import Textinput from '@/components/textinput'

const user = inject('user')
const router = useRouter()
const route = useRoute()
const suggestion = ref({})
const server_response = ref('')
const submission = ref({ question: '', suggestions: new Set() })

if (user.value.error_code !== undefined)
	await router.push({
		name:	'login',
		query: { ...route.query, redirected_from: 'rankings/submit' }
	})

const { data: users } = await useFetch(
	'http://localhost:3000/api/users',
	{ headers: { credentails: 'include', authorization: user?.value?.token } }
)

const { data: teachers } = await useFetch(
	'http://localhost:3000/api/teachers',
	{ headers: { credentails: 'include', authorization: user?.value?.token } }
)

users.value ??= []
teachers.value ??= []
const items = [ ...users.value, ...teachers.value ]

function add_suggestion() {
	submission.value.suggestions.add(suggestion.value)
}

async function submit() {
	let response

	try {
		response = await $fetch('http://localhost:3000/api/rankings/submit', {
			method: 'POST',
			body: {
				question: submission.value.question,
				suggestions: [ ...submission.value.suggestions ].map(val => val._id)
			},
			headers: { credentails: 'include', authorization: user?.value?.token }
		})

		server_response.value = 'accepted'
		window.setTimeout(() => {
			server_response.value = ''
		}, 5000)
		submission.value.suggestions.clear()
	} catch  {
		console.error(response)
		server_response.value = 'error'
		window.setTimeout(() => {
			server_response.value = ''
		}, 5000)
	}
}
</script>

<template>
	<article class='rankings-submit'>
		<form @submit.prevent='submit'>
			<fieldset>
				<Textinput v-model='submission.question' placeholder='question' required/>
				<span>
					<Searchbox :items='items' keys='name' v-model='suggestion'>schüler auswählen:</Searchbox>
					<button type='button' @click='add_suggestion'>add</button>
				</span>
			</fieldset>

			<Submitbutton/>
		</form>

		<p>{{ submission }}</p>
		<p
			class='server_response'
			:class='{ accepted: server_response === "accepted" }'
		>
			{{ server_response }}
		</p>
	</article>
</template>

<style lang='scss'>
@use '@/assets/scss/mixins.scss';
@use '@/assets/scss/colors.scss';

.rankings-submit {
	> form {
		> fieldset {
			margin: 1rem 0;
			border-width: 3px 0;
			border-style: double;
			border-color: colors.$secondary;

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

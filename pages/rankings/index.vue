<script setup lang='ts'>
import Dropdown from '@/components/dropdown.vue'
import Submitbutton from '@/components/submitbutton.vue'

const user = inject('user')
const route = useRoute()
const router = useRouter()
const submission = ref({})

if (user.value.error_code !== undefined)
	await router.push({
		name:	'login',
		query: { ...route.query, redirected_from: 'rankings' }
	})

const { data: questions } = await useFetch(
	'http://localhost:3000/api/rankings',
	{ headers: { credentails: 'include', authorization: user?.value?.token } }
)

async function submit() {
	console.log(submission.value)
}
</script>

<template>
	<article class='rankings'>
		<h1>Abi-Rankings</h1>

		<form @submit.prevent='submit'>
			<fieldset v-for='question in questions' :key='question._id'>
			 <h2>{{ question.question }}</h2>
			 <Dropdown v-model='submission[question._id]' :items='question.suggestions' keys='name'>Antwort auswählen</Dropdown>
			</fieldset>

			<Submitbutton value='Abstimmung einsenden'/>
		</form>

		<p>{{ submission }}</p>
	</article>
</template>

<style lang='scss'>
@use '@/assets/scss/colors.scss';

.rankings {
	> form {
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
				font-size: 1.75rem;
			}
		}

		> .submitbutton {
			margin: 1rem auto 0 auto;
		}
	}
}
</style>

<script setup lang='ts'>
import Searchbox from '@/components/searchbox.vue'
import Dropdown from '@/components/dropdown.vue'

const user = await inject('user')
const selection = ref({})
const users = await useFetch(
	'http://localhost:3000/api/users',
	{ headers: { authorization: useNuxtApp().$token() ?? '' } }
)
const items = users.data.value ?? []

function callback() {
}
</script>

<template>
	<article class='rankings'>
		<form @submit.prevent='callback'>
			<fieldset>
				<h2>wer hat immer die händ' am sack?</h2>
				<Dropdown :items='items' keys='name' v-model='selection.test2'>schüler auswählen:</Dropdown>
			</fieldset>

			<input type='submit'/>
		</form>

		<p>{{ selection }}</p>
	</article>
</template>

<style lang='scss'>
@use '@/assets/scss/mixins.scss';
@use '@/assets/scss/colors.scss';

.rankings {
	> form > fieldset {
		margin: 1rem 0;
		border-width: 3px 0;
		border-style: double;
		border-color: colors.$secondary;
		
		> h2 {
			margin: 0 0 0.5em 0;
		}
	}
}
</style>

<script setup lang='ts'>
import { ref, inject, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { frontend_config as config } from '@/config'
import Loading from '@/components/loading.vue'
import Textmessage from '@/components/textmessage.vue'

const router = useRouter()
const query = useRoute().query
const quotes = ref<Record<string, any>>({})
const count = ref(0)
const loading = ref(true)
const user: any = inject('user')

const page = ref<number>(
	isNaN(parseInt(query.page?.toString() ?? '')) ?
	0 :
	parseInt(query.page?.toString() ?? '')
)

const limit = ref<number>(
	isNaN(parseInt(query.limit?.toString() ?? '')) ?
	5 :
	parseInt(query.limit?.toString() ?? '')
)

async function getQuotes() {
	loading.value = true

	const response = await Promise.all([
		fetch(`${ config.url }/api/quotes?limit=${ limit.value }&offset=${ limit.value * page.value }`, {
			credentials: 'include'
		}),

		fetch(`${ config.url }/api/quotes/count`, {
			credentials: 'include'
		}),
	])

	if (!response.every(res => res.ok))
		return

	const count_data = parseInt(await response[1].text())

	quotes.value = await response[0].json()
	count.value = isNaN(count_data) ? 0 : count_data
	
	loading.value = false
}

async function navigate(direction: 1 | -1) {
	if (
		page.value + direction < 0 ||
		page.value + direction > Math.floor(count.value / limit.value)
	)
		return

	page.value += direction
	getQuotes()
}

watch(page, val => {
	router.push({
		name: 'quotes',
		query: { page: val }
	})
})

getQuotes()
</script>

<template>
	<article class='quotes'>
		<Loading :loading='loading'>
			<router-link to='/quotes/submit'>→ Zitat einreichen</router-link>

			<section v-for='quote in quotes' :key='quote._id'>
				<Textmessage
					v-for='message in quote.messages'
					:key='message._id'
					:type='message.type'
					:side='message.side'
					:name='message.name'
					:text='message.text'
				/>
				<p v-if='user.privileges.includes("admin")'>- {{ quote.submitted_by }}</p>
			</section>
			
			<div>
				<a @click='navigate(-1)'>←</a>
				<span>
					<input type='number' v-model='page' @keypress.enter='getQuotes()'/>
					<span> / {{ Math.floor(count / limit) }}</span>
				</span>
				<a @click='navigate(1)'>→</a>
			</div>
		</Loading>
	</article>
</template>

<style lang='scss'>
@use '@/assets/scss/colors.scss';
@use 'sass:color';

.quotes {
	> a {
		color: inherit;
		text-align: right;
		display: block;
	}

	> section {
		background-color: color.adjust(colors.$dark-grey, $lightness: +5%);
		border-radius: 0.5em;
		border: 1px solid colors.$primary;
		box-shadow: inset 0 0.25rem 0.5rem colors.$black;
		padding: 1rem;
		margin: 1rem 0;
		box-sizing: border-box;

		> p {
			text-align: right;
			margin: 0;
		}
	}

	> div {
		display: flex;
		justify-content: center;
		gap: 1rem;

		> a {
			cursor: pointer;
			font-size: 1.5em;

			&:hover {
				text-shadow: 0 0.25rem 0.5rem colors.$white;
			}
		}

		> span {
			> input {
				width: 2rem;
				border-radius: 0.5em;
				padding: 0.25em 1.25em;
				text-align: center;
				appearance: textfield;
				background: colors.$black;
				border: 1px solid colors.$white;
				outline: none;
				color: inherit;

				&::-webkit-inner-spin-button,
				&::-webkit-outer-spin-button {
					-webkit-appearance: none;
					margin: 0;
				}
			}
		}
	}
}
</style>

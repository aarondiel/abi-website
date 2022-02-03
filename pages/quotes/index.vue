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

const editable = ref<boolean>(
	query.edit?.toString() === 'true' &&
	user.value.privileges.includes('admin')
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

function delete_message(quote, message_id: string) {
	const index = quotes.value.indexOf(quote)
	quotes.value[index].messages = quotes.value[index].messages.filter(message => message._id !== message_id)
}

async function delete_quote(quote) {
	quotes.value = quotes.value.filter(q => q !== quote)

	const response = fetch(`${ config.url }/api/quotes/${ quote._id }`, {
		method: 'DELETE',
		credentials: 'include'
	})
}

async function update_quote(quote) {
	const index = quotes.value.indexOf(quote)

	const body = { ...quotes.value[index] }
	delete body.submitted_by

	const response = await fetch(`${ config.url }/api/quotes/${ quote._id }`, {
		method: 'PUT',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	})
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
					v-model:name='message.name'
					v-model:text='message.text'
					:editable='editable'
					@close='delete_message(quote, message._id)'
				/>

				<div v-if='user.privileges.includes("admin")' class='admin'>
					<button
						v-if='editable'
						@click='delete_quote(quote)'
					>
						delete quote
					</button>

					<button
						v-if='editable'
						@click='update_quote(quote)'
					>
						update quote
					</button>

					<div v-else class='spacer'></div>

					<p>- {{ quote.submitted_by }}</p>
				</div>
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
@use '@/assets/scss/mixins.scss';
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

		> .admin {
			display: flex;
			justify-content: space-between;
			align-items: center;

			> button {
				@include mixins.gold_border;

				padding: 0.5rem;
				border: none;
				color: inherit;
				cursor: pointer;
				display: block;
			}
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

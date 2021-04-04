<template>
	<div class='quotes'>
		<h2>quotes</h2>

		<blockquote v-for='quote in quotes' :key='quote._id'>
			<TextMessage
				v-for='message in quote.messages'
				:key='message._id'
				:type='message.type'
				:side='message.side'
				:name='message.name'
			>
				{{ message.text }}
			</TextMessage>
		</blockquote>

		<span>
			<a @click='navigatePage($router, -1)'>← vorherige seite</a>
			<a>zitat einreichen</a>
			<a @click='navigatePage($router, 1)'>nächste seite →</a>
		</span>
	</div>
</template>

<script>
import TextMessage from '../components/TextMessage.vue';
import { ref } from 'vue';

export default {
	name: 'Quotes',

	props: {
		page: {
			type: String,
			default: ':0'
		}
	},

	components: {
		TextMessage
	},

	setup(props) {
		const quotes = ref([]);
		let offset = props?.page ?? ':0';

		// test if page prop is valid
		if (!/:\d+/.test(offset))
			offset = ':0';

		offset = parseInt(offset.slice(1, offset.length));

		async function getQuotes() {
			const response = await fetch(
				`https://aarondiel.com/abi/api/quotes?offset=${3 * offset}&limit=3`,
				{
					method: 'GET',
					mode: 'cors',
					cache: 'no-cache',
					credentials: 'omit',
					headers: { 'Content-Type': 'application/json' },
					redirect: 'follow',
					referrerPolicy: 'no-referrer'
				}
			);

			if (response.ok) {
				const message = await response.json();
				quotes.value = message;
				return;
			}

			quotes.value =  [ {
				_id: 1,
				submittedBy: 'anonymous',
				messages: [ {
					_id: 1,
					type: 'info',
					text: 'couldn\'t fetch quotes'
				} ]
			} ];
		}

		getQuotes();

		function navigatePage(router, page) {
			if (typeof page === 'number') {
				offset += page
				getQuotes()
			}

			router.push({ name: 'quotes', params: { page: `:${offset}` } })
		}

		return { quotes, getQuotes, navigatePage }
	}
};
</script>

<style lang='scss'>
@use '../scss/media';
@use '../scss/colors';

.quotes {
	width: 100%;
	padding: 1rem;
	box-sizing: border-box;

	@include media.phone {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;

		> h2 {
			grid-column: 1 / span 3;
		}

		> blockquote {
			grid-column-end: span 2;

			&:nth-child(2n) {
				grid-column-start: 2;
			}
		}
	}

	blockquote {
		width: 100%;
		margin: 0 0 1rem 0;
		padding: 1rem;
		box-sizing: border-box;
		box-shadow: inset 0 0.25rem 0.5rem mix(#000000, #ffffff, 25%);
		border-radius: 1rem;
	}

	> span {
		color: colors.$secondary;
		grid-column: 1 / span 3;
		display: flex;
		justify-content: space-between;

		a {
			cursor: pointer;
		}
	}
}
</style>

<template>
	<div class='quotes'>
		<div v-if='submission' class='submission'>
			<blockquote>
				<TextMessage
					v-for='message in submissionBuffer'
					:key='message.id'
					:editable='true'
					:closable='true'
					:type='message.type'
					:side='message.side'
					:ref='el => { if (el) message.ref = el }'
					@close='deleteMessage(message.id)'
				/>
			</blockquote>

			<span>
				<TextMessage side='left' @click='addMessage("left")'>neue nachricht</TextMessage>
				<TextMessage type='info' @click='addMessage("info")'>neue nachricht</TextMessage>
				<TextMessage side='right' @click='addMessage("right")'>neue nachricht</TextMessage>
			</span>

			<section>
				<TextInput ref='codeInput' :defaultText='$route.query.code'>zugangscode</TextInput>
				<button @click='submitQuote'>zitat einreichen</button>
				<p ref='submitResponse'></p>
			</section>
		</div>

		<div v-else>
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
		</div>

		<span>
			<a @click='navigatePage($router, -1)'>← vorherige seite</a>

			<a v-if='submission' @click='navigatePage($router, 0)'>zu den zitaten</a>
			<a v-else @click='navigatePage($router, "submit")'>zitat einreichen</a>

			<a @click='navigatePage($router, 1)'>nächste seite →</a>
		</span>
	</div>
</template>

<script>
import TextMessage from '../components/TextMessage.vue';
import TextInput from '../components/TextInput.vue';
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
		TextMessage,
		TextInput
	},

	setup(props) {
		const quotes = ref([]);
		const submission = ref(false);
		const submissionBuffer = ref([]);
		const codeInput = ref();
		const submitResponse = ref();

		let offset = props?.page ?? ':0';

		if (offset === ':submit') {
			submission.value = true;
			offset = 0;
		} else {
			offset = parseInt(offset.slice(1, offset.length));

			offset = isNaN(offset) ? 0 : offset;
		}

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

		if (!submission.value)
			getQuotes();

		function addMessage(type) {
			submissionBuffer.value.push({
				type: type === 'info' ? 'info' : 'message',
				side: type === 'info' ? undefined : type,
				id: Math.floor(Math.random() * 0xffffff),
				ref: null
			})
		}

		function deleteMessage(id) {
			submissionBuffer.value = submissionBuffer.value.filter(v => v.id !== id);
		}

		async function submitQuote() {
			for (const message of submissionBuffer.value) {
				const content = message.ref.getContent();
				message.text = content.content;
				message.name = content.name;
			}

			const code = codeInput.value.text;

			const messages = submissionBuffer.value.map(v => {
				return {
					type: v.type,
					side: v.side,
					text: v.text,
					name: v.name
				}
			})

			const response = await fetch('https://aarondiel.com/abi/api/quotes', {
				method: 'POST',
				mode: 'cors',
				cache: 'no-cache',
				credentials: 'omit',
				headers: { 'Content-Type': 'application/json' },
				redirect: 'follow',
				referrerPolicy: 'no-referrer',
				body: JSON.stringify({ code, messages })
			});

			const message = await response.json();

			if (response.ok)
				submitResponse.value.className='ok';
			else
				submitResponse.value.className='failed';

			submitResponse.value.innerText = message.message;
		}

		function navigatePage(router, page) {
			if (typeof page === 'number') {
				submission.value = false;

				offset += page;
				getQuotes();
				router.push({ name: 'quotes', params: { page: `:${offset}` } });
				return;
			}

			quotes.value = [];
			submission.value = true;
			router.push({ name: 'quotes', params: { page: `:${page}` } });
		}

		return {
			quotes,
			navigatePage,
			submission,
			codeInput,
			submitResponse,
			submissionBuffer,
			deleteMessage,
			addMessage,
			submitQuote
		};
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
		> div:not(.submission) {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 1rem;

			> blockquote {
				grid-column-end: span 2;

				&:nth-child(2n) {
					grid-column-start: 2;
				}
			}
		}
	}

	> div > blockquote {
		width: 100%;
		margin: 0 0 1rem 0;
		padding: 1rem;
		box-sizing: border-box;
		box-shadow: inset 0 0.25rem 0.5rem mix(#000000, #ffffff, 25%);
		border-radius: 1rem;
	}

	> div.submission > span {
		display: flex;
		justify-content: space-between;
		flex-direction: column;

		@include media.tablet {
			flex-direction: row;
		}

		> .textMessage {
			cursor: pointer;
			width: 30%;
		}
	}

	> div.submission > section {
		background-color: colors.$primary;
		color: #ffffff;
		margin: 0 -1rem 1rem -1rem;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;

		> * + * {
			margin-top: 1rem;
		}

		> form {
			width: 100%;
		}

		> p {
			&.ok {
				color: green
			}

			&.failed {
				color: red;
			}
		}


		@include media.phone {
			flex-direction: row;

			> * + * {
				margin-top: 0;
			}

			> form {
				width: unset;
			}
		}

		> button {
			background-color: colors.$light-grey;
			border: none;
			cursor: pointer;
			border-radius: 0.25rem;
			padding: 1rem;

			&:hover {
				background-color: #ffffff;
			}
		}
	}

	> span {
		color: colors.$secondary;
		display: flex;
		justify-content: space-between;

		a {
			cursor: pointer;
		}
	}
}
</style>

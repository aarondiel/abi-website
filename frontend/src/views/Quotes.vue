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

	</div>
</template>

<script>
import TextMessage from '../components/TextMessage.vue';
import { ref } from 'vue';

export default {
	name: 'Quotes',

	components: {
		TextMessage
	},

	setup() {
		let quotes = ref(new Array());

		const getQuotes = async () => {
			const response = await fetch('http://aarondiel.com/abi/api/quotes', {
				method: 'GET',
				mode: 'cors',
				cache: 'no-cache',
				credentials: 'omit',
				headers: { 'Content-Type': 'application/json' },
				redirect: 'follow',
				referrerPolicy: 'no-referrer',
			})


			if (response.ok) {
				const message = await response.json();
				console.log(message)
				quotes.value = message;
				return;
			}

			quotes.value =  [ {
				_id: 1,
				submittedBy: 'anonymous',
				messages: [ {
					_id: 1,
					type: 'info',
					text: "couldn't fetch quotes"
				} ]
			} ];
		}

		getQuotes();

		return { quotes, getQuotes }
	}
};
</script>

<style lang='scss'>
.quotes {
	width: 100%;
	padding: 1rem;
	box-sizing: border-box;

	> blockquote {
		width: 100%;
		margin: 0 0 1rem 0;
		padding: 1rem;
		box-sizing: border-box;
		box-shadow: inset 0 0.25rem 0.5rem mix(#000000, #ffffff, 25%);
		border-radius: 1rem;
	}
}
</style>

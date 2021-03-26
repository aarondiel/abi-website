<template>
	<div class='quotes'>
		<h2>quotes</h2>

		<blockquote v-for='quote in getQuotes()' :key='quote._id'>
			<TextMessage
				v-for='message in quote.messages'
				:key='message._id'
				:type='message.type'
				:side='message.side'
			>
				{{ message.text }}
			</TextMessage>
		</blockquote>

	</div>
</template>

<script>
import TextMessage from '../components/TextMessage.vue';

export default {
	name: 'Quotes',

	components: {
		TextMessage
	},

	setup() {
		/*let quotes = [*/
			/*{*/
				/*_id: 1234,*/
				/*messages: [*/
					/*{*/
						/*_id: 1234,*/
						/*type: 'info',*/
						/*text: 'kill me please1'*/
					/*},*/

					/*{*/
						/*_id: 4312,*/
						/*type: 'message',*/
						/*side: 'right',*/
						/*text: 'kill me please2'*/
					/*},*/

					/*{*/
						/*_id: 2341,*/
						/*type: 'message',*/
						/*side: 'left',*/
						/*text: 'kill me please3'*/
					/*}*/
				/*]*/
			/*},*/
		/*]*/

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
				return message;
			}

			return [ {
				_id: 1,
				message: [ {
					_id: 1,
					type: 'info',
					text: "couldn't fetch quotes"
				} ]
			} ];
		}

		return { getQuotes }
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

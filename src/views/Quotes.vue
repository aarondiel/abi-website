<template>
	<div class='quotes'>
		<h2>quotes</h2>

		<blockquote v-for='sample in sampleData' :key='sample._id'>
			<TextMessage
				v-for='message in sample.messages'
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
import { ref } from 'vue';

export default {
	name: 'Quotes',

	components: {
		TextMessage
	},

	setup() {
		let sampleData = [
			{
				_id: 1234,
				messages: [
					{
						_id: 1234,
						type: 'message',
						side: 'left',
						text: 'kill me please1'
					},

					{
						_id: 4312,
						type: 'message',
						side: 'right',
						text: 'kill me please2'
					},

					{
						_id: 2341,
						type: 'message',
						side: 'left',
						text: 'kill me please3'
					}
				]
			},
		]

		sampleData = ref(sampleData)

		return { sampleData }
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

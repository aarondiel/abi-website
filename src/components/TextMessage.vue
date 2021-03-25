<template>
	<div class='textMessage' ref='textMessage'>
		<slot/>
		<svg
			viewBox='0 0 100 100'
			xmlns='http://www.w3.org/2000/svg'
			ref='textHandle'
			v-if="type === 'message'"
		>
			<path d='
				M 50, 20
				l 50, 80
				h -100
				z
			'/>
		</svg>
	</div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
	name: 'TextMessage',

	props: {
		type: {
			type: String,
			default: 'message',
			validator: v => {
				return [ 'message', 'info' ].indexOf(v) !== -1;
			}
		},

		name: {
			type: String,
			default: ''
		},

		side: {
			type: String,
			validator: v => {
				return [ 'left', 'right' ].indexOf(v) !== -1;
			}
		}
	},

	setup(props) {
		const result = new Object();
		const textMessage = ref(null);

		if (props.type === 'message') {
			const textHandle = ref(null)
			const side = props?.side ?? 'left';

			result.textHandle = textHandle;

			onMounted(() => {
				textMessage.value.classList.add(side);
				textHandle.value.classList.add(side);
			})
		}

		if (props.type === 'info') {
			onMounted(() => {
				textMessage.value.classList.add('info');
			})
		}

		result.textMessage = textMessage;
		return result;
	}
};
</script>

<style lang='scss'>
@use '../scss/colors';

.textMessage {
	color: #ffffff;
	padding: 1rem;
	border-radius: 0.75rem;
	width: 60%;
	margin-bottom: 1rem;

	&.info {
		color: inherit;
		background-color: colors.$light-grey;
		width: 80%;
		margin-left: auto;
		margin-right: auto;
	}

	&.left {
		transform: translateX(1rem);
		margin-right: auto;
		background-color: colors.$primary;
	}

	&.right {
		transform: translateX(-1rem);
		margin-left: auto;
		background-color: colors.$secondary;
	}

	> svg {
		position: absolute;
		width: 1.5rem;
		height: 1.5rem;
		bottom: 0;

		&.left {
			transform: translateX(-0.75rem);
			left: 0;
			fill: colors.$primary;
		}

		&.right {
			transform: translateX(0.75rem);
			right: 0;
			fill: colors.$secondary;
		}
	}
}
</style>

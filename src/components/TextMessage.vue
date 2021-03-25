<template>
	<div class='textMessage' ref='container'>
		<p><slot/></p>
		<svg
			viewBox='0 0 100 100'
			xmlns='http://www.w3.org/2000/svg'
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
		const container = ref(null);

		let classes = new Array();
		if (props.type === 'message') {
			const side = props?.side ?? 'left';

			classes.push(side);
		}

		if (props.type === 'info')
			classes.push('info');

		onMounted(() => {
			container.value.classList.add(classes.join(' '));
		})

		return { container }
	}
};
</script>

<style lang='scss'>
@use '../scss/colors';

.textMessage {
	max-width: 60%;
	margin-bottom: 1rem;

	&.left {
		transform: translateX(1rem);

		> p {
			background-color: colors.$primary;
		}

		> svg {
			transform: translateX(-0.75rem);
			left: 0;
			fill: colors.$primary;
		}
	}

	&.right {
		transform: translateX(-1rem);
		margin-left: auto;
		text-align: right;

		> p {
			background-color: colors.$secondary;
		}

		> svg {
			transform: translateX(0.75rem);
			right: 0;
			fill: colors.$secondary;
		}
	}

	&.info > p {
		color: inherit;
		background-color: colors.$light-grey;
		max-width: 80%;
		margin-left: auto;
		margin-right: auto;
	}

	> p {
		display: inline-block;
		padding: 1rem;
		border-radius: 0.75rem;
		color: #ffffff;
	}

	> svg {
		position: absolute;
		width: 1.5rem;
		height: 1.5rem;
		bottom: 0;
	}
}
</style>

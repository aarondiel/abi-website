<template>
	<div class='textMessage' ref='container'>
		<h5 :contentEditable='editable' ref='contentName'>{{ name }}</h5>
		<p :contentEditable='editable' ref='content'><slot/></p>
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
		},

		editable: {
			type: Boolean,
			default: false
		}
	},

	setup(props) {
		const container = ref();
		const contentName = ref();
		const content = ref();

		let classes = [];
		if (props.type === 'message') {
			const side = props?.side ?? 'left';

			classes.push(side);
		}

		if (props.type === 'info')
			classes.push('info');

		if (props.editable)
			classes.push('editable');

		onMounted(() => {
			container.value.classList.add(...classes);
		});

		const getContent = () => {
			return {
				name: contentName.value.innerText,
				content: content.value.innerText
			}
		}

		return { container, getContent, contentName, content };
	}
};
</script>

<style lang='scss'>
@use '../scss/colors';

.textMessage {
	max-width: 60%;
	margin-bottom: 1rem;
	word-wrap: break-word;
	display: flex;
	flex-direction: column;

	> *:focus-visible {
		outline: none;
	}

	> * {
		max-width: 100%;
	}

	> p {
		display: inline-block;
		padding: 1rem;
		border-radius: 0.75rem;
		color: #ffffff;
	}

	> svg {
		position: absolute;
		bottom: 0;
		width: 1.5rem;
		height: 1.5rem;
	}

	&.left {
		transform: translateX(1rem);
		margin-right: auto;

		h5 {
			margin-right: auto;
		}

		> p {
			background-color: colors.$primary;
			align-self: flex-start;
		}

		> svg {
			transform: translateX(-0.75rem);
			fill: colors.$primary;
		}
	}

	&.right {
		transform: translateX(-1rem);
		margin-left: auto;

		h5 {
			margin-left: auto;
		}

		> p {
			background-color: colors.$secondary;
			align-self: flex-end;
		}

		> svg {
			transform: translateX(0.75rem);
			right: 0;
			fill: colors.$secondary;
		}
	}

	&.info {
		margin-left: auto;
		margin-right: auto;
		max-width: 80%;

		> h5 {
			margin: 0 auto;
		}

		> p {
			color: inherit;
			background-color: colors.$light-grey;
			align-self: center;
		}
	}

	&.editable > h5 {
		border-bottom: 4px solid colors.$grey;
		margin-bottom: 0.125rem;
		min-width: 2rem;
	}
}
</style>

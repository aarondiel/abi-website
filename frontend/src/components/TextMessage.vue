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
		const container = ref(null);
		const contentName = ref(null);
		const content = ref(null);

		let classes = new Array();
		if (props.type === 'message') {
			const side = props?.side ?? 'left';

			classes.push(side);
		}

		if (props.type === 'info')
			classes.push('info');

		onMounted(() => {
			container.value.classList.add(classes.join(' '));
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

	> *:focus-visible {
		outline: none;
	}

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

		h5 {
			margin-left: auto;
		}

		> p {
			background-color: colors.$secondary;
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
		text-align: center;

		> h5 {
			margin: 0 auto;
			max-width: 80%;
		}

		> p {
			color: inherit;
			background-color: colors.$light-grey;
		}
	}

	h5 {
		word-wrap: break-word;
		max-width: 60%;
	}

	> p {
		max-width: 60%;
		display: inline-block;
		padding: 1rem;
		border-radius: 0.75rem;
		color: #ffffff;
		word-wrap: break-word;
	}

	> svg {
		position: absolute;
		width: 1.5rem;
		height: 1.5rem;
		bottom: 0;
	}
}
</style>

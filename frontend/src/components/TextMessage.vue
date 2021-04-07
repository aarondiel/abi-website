<template>
	<div class='textMessage' ref='container'>
		<div>
			<h5 :contentEditable='editable' ref='contentName'>{{ name }}</h5>

			<p :contentEditable='editable' ref='content'><slot/></p>
		</div>

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

		<img v-if='closable' src='../assets/trash.svg' alt='delete' @click='$emit("close", $event.target)'/>
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
		},

		closable: {
			type: Boolean,
			default: false
		}
	},

	emits: [ 'close' ],

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

			contentName.value.onpaste = (e) => {
				console.log(e)
				e.target.innerText = e.srcElement.innerText;
			}
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

$triangleSize: 1.5rem;

.textMessage {
	position: relative;
	margin-bottom: 1rem;
	display: flex;
	align-items: center;
	gap: 1rem;

	div {
		display: flex;
		flex-direction: column;
		word-wrap: break-word;
		max-width: 50%;

		> *:focus-visible {
			outline: none;
		}

		> p {
			display: inline;
			border-radius: 0.75rem;
			color: #ffffff;
			padding: 1rem;
		}
	}

	> svg {
		position: absolute;
		bottom: 0;
		width: $triangleSize;
		height: $triangleSize;
	}

	> img {
		width: 2.5rem;
		height: 2.5rem;
		cursor: pointer;
	}

	&.left {
		padding-left: $triangleSize / 2;

		> div > p {
			background-color: colors.$primary;
		}

		> svg {
			left: 0;
			fill: colors.$primary;
		}
	}

	&.right {
		padding-right: $triangleSize / 2;
		flex-flow: row-reverse;

		> div > p {
			background-color: colors.$secondary;
		}

		> svg {
			right: 0;
			fill: colors.$secondary;
		}
	}

	&.info {
		justify-content: center;

		> div > p {
			color: inherit;
			background-color: colors.$light-grey;
		}
	}

	&.editable > div > h5 {
		border-bottom: 2px solid colors.$grey;
		margin-bottom: 0.125rem;
		min-width: 2rem;
	}
}
</style>

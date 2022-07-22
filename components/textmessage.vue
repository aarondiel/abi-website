<script setup lang='ts'>
const props = defineProps<{
	type: 'message' | 'info',
	name?: string,
	side?: 'left' | 'right',
	text: string,
	editable?: boolean
}>()

const name_value = props.name
const text_value = props.text

const emit = defineEmits([
	'update:name',
	'update:text',
	'close'
])

function update(type: 'name' | 'text', target: EventTarget | null) {
	if (!(target instanceof HTMLElement))
		return

	emit(`update:${ type }`, target.textContent)
}
</script>

<template>
	<div
		class='textmessage'
		:class='{ right: props.side === "right", center: props.type === "info" }'
	>
		<p
			:contenteditable='editable'
			class='name'
			:class='{ editable: editable }'
			@input='update("name", $event.target)'
		>
			{{ name_value }}
		</p>
		<p
			:contenteditable='props.editable'
			class='content'
			@input='update("text", $event.target)'
		>
			{{ text_value }}
		</p>
		<svg
			viewBox='0 0 100 100'
			xmlns='http://www.w3.org/2000/svg'
			v-if='type === "message"'
		>
			<path d='
				M 0, 0
				h 100
				v 100
				z
			'/>
		</svg>

		<button
			v-if='props.editable'
			class='close'
			@click='emit("close")'
		>
			x
		</button>
	</div>
</template>

<style lang='scss'>
@use '@/assets/scss/colors.scss';
@use 'sass:color';

.textmessage {
	display: flex;
	position: relative;
	margin: 0.5em auto;
	padding: 0.75rem 0 0 0.5em;
	word-wrap: break-word;

	&.right {
		flex-direction: row-reverse;
		padding: 0.75rem 0.5em 0 0;
		text-align: right;

		> .content {
			background-color: colors.$primary;
		}

		> svg {
			fill: colors.$primary;
			transform: rotate(180deg) translateX(calc(-100% + 0.45em));
			bottom: 0;
		}

		> .close {
			right: auto;
			left: 0;
			transform: translateX(50%) translateY(-50%);
		}
	}

	&.center {
		justify-content: center;
		text-align: center;

		> .content {
			background-color: color.adjust(
				colors.$grey,
				$alpha: -0.6
			);
		}
	}

	> .name {
		top: -2px;
		transform: translateY(-100%);
		position: absolute;
		font-size: 0.8em;
		min-width: 10ch;
		outline: none;

		&.editable {
			border-width: 0 0 2px 0;
			border-color: colors.$grey;
			border-style: dashed;
		}
	}

	> .content {
		background-color: colors.$secondary;
		box-shadow: 0 0.25rem 0.5rem colors.$black;
		margin: 0;
		padding: 0.5em;
		border-radius: 0.5em;
		max-width: 60%;
		min-width: 10ch;
		min-height: 1rem;
		outline: none;
	}

	> svg {
		fill: colors.$secondary;
		position: absolute;
		width: 1.5em;
		transform: translateX(calc(-100% + 0.45em));
	}

	> .close {
		position: relative;
		font-size: 1.25rem;
		top: 0;
		height: 1.75em;
		right: 0;
		transform: translateX(-50%) translateY(-50%);
		aspect-ratio: 1/1;
		background: none;
		color: inherit;
		border: none;
		text-shadow: 0 0.25rem 0.5rem colors.$black;
		cursor: pointer;
	}
}
</style>

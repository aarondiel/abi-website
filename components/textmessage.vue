<script setup lang='ts'>
const props = defineProps<{
	type: 'message' | 'info',
	name?: string,
	side?: 'left' | 'right',
	text: string,
	editable?: boolean
}>()

// these variables exist to medigate cursor hoppen when
// data changes get emitted
const name = props.name
const text = props.text

const emit = defineEmits([
	'update:name',
	'update:text'
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
			:contenteditable='props.editable'
			class='name'
			:class='{ editable: props.editable }'
			@input='update("name", $event.target)'
		>
			{{ name }}
		</p>
		<p
			:contenteditable='props.editable'
			class='content'
			@input='update("text", $event.target)'
		>
			{{ text }}
		</p>
		<svg
			viewBox='0 0 100 100'
			xmlns='http://www.w3.org/2000/svg'
			v-if="type === 'message'"
		>
			<path d='
				M 0, 0
				h 100
				v 100
				z
			'/>
		</svg>
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
}
</style>

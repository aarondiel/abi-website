<script setup lang='ts'>
const props = defineProps<{
	modelValue?: string,
	type?: string
}>()

const emit = defineEmits([ 'update:modelValue' ])
const type = props.type ?? 'text'

// this function only exists to make the typescript compiler happy
function update (event: Event) {
	if (!(event.target instanceof HTMLInputElement))
		return

	emit('update:modelValue', event.target.value)
}
</script>

<template>
	<span class='textinput'>
		<input
			:type='type'
			v-bind='$attrs'
			:value='props.modelValue'
			@input='update'
		/>
	</span>
</template>

<style lang='scss'>
	@use '@/assets/scss/mixins.scss';
	@use '@/assets/scss/colors.scss';

	.textinput {
		display: block;
		max-width: 20em;
		height: 3em;
		color: colors.$white;
		padding: 0.5em;
		box-sizing: border-box;

		@include mixins.gold_border;

		> input {
			background: none;
			border: none;
			outline: none;
			color: inherit;
			width: 100%;
			height: 100%;
		}
	}
</style>

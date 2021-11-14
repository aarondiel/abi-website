<script setup lang='ts'>
	import type { Ref } from 'vue'

	const props = defineProps<{
		modelValue?: Ref<string>
	}>()

	const emit = defineEmits([ 'update:modelValue' ])
</script>

<template>
	<span class='textinput'>
		<input
			type='text'
			v-bind='$attrs'
			@input='emit("update:modelValue", $event.target.value)'
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

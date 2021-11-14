<script setup lang='ts'>
const emit = defineEmits([ 'click' ])
</script>

<template>
	<span class='submitbutton'>
		<input
			type='submit'
			@click='emit("click", $event)'
			v-bind='$attrs'
		/>
	</span>
</template>

<style lang='scss'>
	@use '@/assets/scss/mixins.scss';
	@use '@/assets/scss/colors.scss';

	.submitbutton {
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
			padding: 0;
			cursor: pointer;
		}
	}
</style>

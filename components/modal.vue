<script setup lang='ts'>
import { defineProps } from 'vue'

const props = defineProps<{
	active?: boolean
}>()
</script>

<template>
	<div class='modal' :class='{ hidden: !props.active }'>
		<div class='menu'>
			<slot/>
		</div>
	</div>
</template>

<style lang='scss'>
@use 'sass:color';
@use '@/assets/scss/colors.scss';
@use '@/assets/scss/mixins.scss';

.modal {
	position: fixed;
	display: flex;
	align-items: center;
	justify-content: center;
	inset: 0;
	background-color: color.adjust(colors.$black, $alpha: -0.5);

	&.hidden {
		display: none;
	}

	> .menu {
		@include mixins.gold_border;

		background-color: red;
		width: 50ch;
		min-height: 20ch;
		box-sizing: border-box;
		padding: 1rem;
		display: flex;
	}
}
</style>

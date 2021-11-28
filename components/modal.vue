<script setup lang='ts'>
const props = defineProps<{
	active: boolean,
	type: 'popup',
}>()

const emit = defineEmits([ 'update:active' ])

function close() {
	emit('update:active', false)
}
</script>

<template>
	<div v-if='props.active' class='modal'>
		<span @click='close'/>

		<div class='menu' ref='menu'>
			<img
				v-if='type === "popup"'
				@click='close'
				src='@/assets/close.svg'
				alt='close'
			/>

			<slot/>
		</div>
	</div>
</template>

<style lang='scss'>
@use 'sass:color';
@use '@/assets/scss/colors.scss';
@use '@/assets/scss/mixins.scss';
@use '@/assets/scss/media.scss';

.modal {
	position: fixed;
	display: flex;
	align-items: center;
	justify-content: center;
	inset: 0;
	z-index: 9000;

	> span {
		display: block;
		position: absolute;
		inset: 0;
		background-color: color.adjust(colors.$black, $alpha: -0.5);
		backdrop-filter: blur(2px);
	}

	> .menu {
		@include mixins.gold_border;

		background-color: red;
		min-width: 10ch;
		min-height: 20ch;
		box-sizing: border-box;
		padding: 1rem;
		display: flex;
		justify-content: center;
		margin-top: 3.125rem;

		@include media.phone() {
			min-width: 35ch;
		}

		> img[alt='close'] {
			display: block;
			position: absolute;
			inset: 0.5rem 0.5rem auto auto;
			width: 2rem;
			cursor: pointer;
		}
	}
}
</style>

<template>
	<div class="submit-button-wrapper">
		<button @click="$emit('click', $event)">
			<slot />
		</button>
	</div>
</template>

<script>
export default {
  name: 'SubmitButton',
  emits: ['click'],
};
</script>

<style scoped lang="scss">
$disabled: #002d3e;
$focused: #00feff;

div.submit-button-wrapper {
	button {
		width: 200%;
		background-color: transparent;
		color: #ffffff;
		font-family: 'Roboto Mono';
		border: dashed 0.35em $disabled;
		border-radius: 0.25em;
		transition: ease-in-out 0.2s;

		&:hover {
			background-color: #d7d7db;
			color: #000000;
			border-color: $focused;
		}
	}
}
</style>

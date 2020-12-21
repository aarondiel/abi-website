<template>
	<label class="textfield-wrapper">
		<input
			type="text"
			:value="text"
			@input="$emit('update:text', $event.target.value)"
			id="textfield-input"
			required
		/>
		<span>{{ name }}</span>
	</label>
</template>

<script>
export default {
	name: 'Textfield',
	props: {
		name: String,
		text: String
	},
	emits: ["update:text"],
};
</script>

<style scoped lang='scss'>
$disabled: #002d3e;
$focused: #00feff;

label.textfield-wrapper {
	margin: 0.5em 0 0 0;
	position: relative;
	font-family: 'Roboto Mono';
	height: 2.5em;
	border-radius: 0.25em;

	span {
		font-size: 1em;
		display: block;
		position: absolute;
		color: #ffffff;
		top: 0;
		transition: 0.2s;
	}

	&:hover {
		cursor: text;
	}
}

input#textfield-input {
	background: transparent;
	width: 100%;
	border: 0;
	outline: 0;
	border-bottom: dashed 5px $disabled;
	color: #ffffff;
	transition: 0.5s;
	outline: none;
	
	&:invalid {
		box-shadow: none;
	}

	&:valid ~ span {
		font-size: 0.9em;
		color: $disabled;
		transform: translateY(-1.1em);
	}

	&:focus {
		border-bottom-color: $focused;

		~ span {
			font-size: 0.9em;
			color: $focused;
			transform: translateY(-1.1em);
		}
	}
}
</style>

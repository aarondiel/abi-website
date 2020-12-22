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
		<hr />
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
	position: relative;
	font-family: 'Roboto Mono';

	span {
		width: 100%;
		heigth: 100%;
		font-size: 0.9em;
		display: block;
		position: absolute;
		top: calc((100% - 0.9em)/2);
		color: #ffffff;
		transition: 0.2s;
	}

	hr {
		margin: 0;
		width: 100%;
		position: absolute;
		bottom: -0.75em;
		border: dashed 0.25em $disabled;
	}

	&:hover {
		cursor: text;
	}
}

input#textfield-input {
	background: transparent;
	border: 0;
	outline: 0;
	width: 100%;
	height: 100%;
	color: #ffffff;
	transition: 0.5s;
	
	&:invalid {
		box-shadow: none;
	}

	&:valid ~ span {
		font-size: 0.8em;
		color: $disabled;
		top: -1em;
	}

	&:focus {
		~ hr {
			border-color: $focused;
		}

		~ span {
			font-size: 0.8em;
			color: $focused;
			top: -1em;
		}
	}
}
</style>

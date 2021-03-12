<template>
	<form class='textInput'>
		<input
			type='text'
			@input='validate($event)'
			:value='defaultText'
			required
		>
		<p ref='title'><slot/></p>
		<hr/>
		<span v-if='unit'>
			<p>{{ unit }}</p>
		</span>
	</form>
</template>

<script>
export default {
	name: 'TextInput',
	props: {
		modelValue: String,
		defaultText: String,
		unit: String
	},
	emits: [ 'update:modelValue' ],
	setup(props) {
		// the text property is there if you don't want to use
		// v-bind to get the text of the input
		let text = props.defaultText ?? '';

		return {
			text
		}
	},
	methods: {
		validate(event) {
			this.text = event.target.value;

			this.$emit('update:modelValue', event.target.value);
		}
	}
};
</script>

<style lang='scss' scoped>
@use '../scss/colors';
@use '../scss/fonts';

.textInput {
	z-index: 0;
	background-color: colors.$light-grey;
	position: relative;
	width: 240px;
	height: 50px;
	border-radius: 5px;
	box-shadow: 0 2px 2px #000000;

	> p {
		z-index: -1;
		position: absolute;
		margin: 0;
		left: 8px;
		top: 50%;
		transform: translateY(-50%);
		font-size: 1.25rem;
		transition: ease-in-out 0.15s;
		color: colors.$grey;
		text-shadow: 0 1px 1px colors.$dark-grey;
	}

	input {
		background: transparent;
		width: 100%;
		height: 100%;
		border: none;
		outline: none;
		padding: 0 0 0 0.5rem;
		color: colors.$black;
		font-family: inherit;

		&:invalid {
			box-shadow: none;
		}

		&:is(:focus, :valid) ~ p {
			left: 8px;
			top: 0;
			color: colors.$primary;
			font-size: 1rem;
		}
	}

	span {
		position: absolute;
		right: 0;
		height: 50px;
		width: 50px;

		p {
			font-size: 2rem;
			font-weight: bold;
			color: #000000;
			margin: 0;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		&:before {
			content: '';
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			background-color: colors.$grey;
			opacity: 0.5;
			border-top-right-radius: 5px;
			border-bottom-right-radius: 5px;
		}
	}
}

hr {
	position: absolute;
	width: 90%;
	left: 50%;
	margin: 0;
	transform: translateX(-50%);
	border: none;
	border-top: 3px dashed colors.$grey;
	bottom: 7px;
}
</style>

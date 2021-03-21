<template>
	<div class='collapsible'>
		<button
			@click='toggle'
			ref='button'
		>
			{{ title }}
		</button>

		<Expandible>
			<legend v-if='active'>
				<slot/>
			</legend>
		</Expandible>
	</div>
</template>

<script>
import { onMounted, ref } from 'vue';
import Expandible from './Expandible.vue';

export default {
	name: 'Collapsible',

	components: {
		Expandible
	},

	props: {
		title: {
			type: String,
			default: 'info'
		},

		toggled: {
			type: Boolean,
			default: false
		}
	},

	setup(props) {
		const active = ref(props.toggled);
		const button = ref(null);

		const updateDom = () => {
			if (active.value)
				button.value.classList.add('active');
			else
				button.value.classList.remove('active');
		}

		const toggle = () => {
			active.value = !active.value;
			updateDom();
		}

		onMounted(() => {
			updateDom();
		})

		return {
			active,
			toggle,
			updateDom,
			button
		};
	}
};
</script>

<style lang="scss" scoped>
@use '../scss/colors';
@use '../scss/fonts';

.collapsible {
	width: 100%;

	> button {
		width: 100%;
		border: 0;
		outline: none;
		font-family: fonts.$heading;
		font-size: 2rem;
		background-color: colors.$primary;
		color: #ffffff;
		transition: all 0.25s ease;
		-webkit-appearance: none;

		&:is(.active, :hover) {
			background-color: colors.$secondary;
		}
	}

	> legend {
		background-color: colors.$light-grey;
		width: 100%;
		padding: 1rem;
		box-sizing: border-box;
	}
}
</style>

<template>
	<div class='collapsible'>
		<button
			@click='collapse'
			ref='button'
		>{{ title }}</button>
		<transition>
			<legend
				ref='content'
			>
				<slot/>
			</legend>
		</transition>
	</div>
</template>

<script>
import { onMounted, ref } from 'vue';

export default {
	name: 'Collapsible',
	props: {
		title: {
			type: String,
			default: 'info'
		},
		toggled: Boolean
	},
	setup(props) {
		console.log(props)
		let active = props.toggled ?? false;

		const button = ref(NaN);
		const content = ref(NaN);

		const collapse = () => {
			active = !active;

			if (active) {
				button.value.classList.add('active');
				content.value.classList.add('active');
			} else {
				button.value.classList.remove('active');
				content.value.classList.remove('active');
			}
		}

		onMounted(() => {
			collapse();
		})

		return {
			active,
			collapse,
			content,
			button
		};
	},
};
</script>

<style lang="scss" scoped>
@use '../scss/colors';
@use '../scss/fonts';

.collapsible {
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
		transition: max-height 0.5s ease-in-out;
		overflow: hidden;
		max-height: 0;

		&.active {
			max-height: 100px;
		}
	}
}
</style>>

<script setup lang='ts'>
import { ref, watch } from 'vue'
import hash from 'object-hash'

const props = defineProps<{
	items: object[],
	keys: string
}>()

const emit = defineEmits([ 'update:modelValue' ])
const menu_hidden = ref(true)
const menu = ref<HTMLDivElement>()
const selection = ref({})

function traverse_path(target: Record<string, any>, path: string[]): string {
	const key: string = path.shift() ?? ''
	const new_target: Record<string, any> | string = target[key]

	if (typeof new_target === 'string')
		return new_target

	return traverse_path(new_target, path)
}

function set_selection(selected: object) {
	menu_hidden.value = !menu_hidden.value
	selection.value = selected
	emit('update:modelValue', selected)
}

function out_of_menu_click(this: Window, ev: MouseEvent) {
	if (!( ev.target instanceof HTMLElement))
		return

	if (!menu.value?.contains(ev.target))
		menu_hidden.value = !menu_hidden.value
}

watch(menu_hidden, val => {
	if (!val)
		window.addEventListener('click', out_of_menu_click)
	else
		window.removeEventListener('click', out_of_menu_click)
})
</script>

<template>
	<div class='dropdown' :class='{ active: !menu_hidden }' ref='menu'>
		<label>
			<img alt='arrow' src='@/assets/arrow.svg'/>

			<slot v-if='!props.items.includes(selection)'/>
			<template v-else>{{ traverse_path(selection, props.keys.split('.')) }}</template>

			<input type='checkbox' v-model='menu_hidden'/>
		</label>
		<ul :class='{ hidden: menu_hidden }'>
			<li
				v-for='item in props.items'
				:key='hash(item)'
				@click='set_selection(item)'
			>
				{{ traverse_path(item, props.keys.split('.')) }}
			</li>
		</ul>
	</div>
</template>

<style lang='scss'>
@use '@/assets/scss/colors.scss';
@use '@/assets/scss/mixins.scss';
@use 'sass:color';

.dropdown {
	max-width: 20em;
	height: 3em;
	color: colors.$white;
	padding: 0.5em;
	box-sizing: border-box;

	@include mixins.gold_border;

	&.active {
		z-index: 10
	}

	&:hover:before {
		background-color: color.adjust(colors.$black, $lightness: +5%);
	}

	> label {
		display: block;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		cursor: pointer;

		> img {
			display: block;
			position: absolute;
			height: 65%;
			z-index: 1;
			inset: auto 1em auto auto;
		}

		> input {
			visibility: hidden;
		}
	}

	> ul {
		position: absolute;
		background-color: color.adjust(colors.$black, $lightness: +0%);
		inset: calc(3rem - 0.5em) 0 auto 0;
		margin: 0;
		padding: 0 0.5em;
		list-style: none;
		max-height: 10rem;
		overflow-y: scroll;
		border-radius: 0 0 0.5em 0.5em;
		scrollbar-color: colors.$white transparent;
		border: solid 2px colors.$secondary;
		z-index: -10;

		&.hidden {
			display: none
		}

		> li {
			cursor: pointer;

			&:hover {
				font-weight: bold;
			}

			&:first-of-type {
				margin-top: 0.5em;
			}
		}
	}
}
</style>

<script setup lang='ts'>
import type { Ref } from 'vue'
import Fuse from 'fuse.js'

const props = defineProps<{
	items: object[]
	keys: string,
	modelValue?: Ref<object>
}>()
const emit = defineEmits([ 'update:modelValue' ])
const suggestions = ref(props.items)
const textinput = ref('')
const textfocused = ref(false)
const menu = ref<HTMLDivElement>()
const fuzzy = new Fuse(props.items, { keys: [ props.keys ?? '' ] })

function out_of_menu_click(this: Window, ev: MouseEvent) {
	if(!menu.value?.contains(ev.target))
		textfocused.value = !textfocused.value
}

function set_selection(selection) {
	textinput.value = selection[props.keys]
	emit('update:modelValue', selection)
	textfocused.value = !textfocused.value
}

watch(textinput, val => {
	suggestions.value = fuzzy.search(val).map(res => res.item)
})

watch(textfocused, val => {
	if (val)
		window.addEventListener('click', out_of_menu_click)
	else
		window.removeEventListener('click', out_of_menu_click)
})
</script>

<template>
	<div
		class='searchbox'
		:class='{ active: textfocused }'
		ref='menu'
	>
		<input
			type='text'
			v-model='textinput'
			@focus='textfocused = true'
		/>
		<img alt='search' src='@/assets/search.svg'>
		<ul :class='{ active: textfocused }'>
			<li
				v-for='suggestion in suggestions'
				:key='suggestion'
				@click='set_selection(suggestion)'
			>
				{{ suggestion[props.keys] }}
			</li>
		</ul>
	</div>
</template>

<style lang='scss'>
@use '@/assets/scss/colors.scss';
@use 'sass:color';
@use '@/assets/scss/mixins.scss';

.searchbox {
	max-width: 20em;
	height: 3em;
	color: colors.$white;

	@include mixins.gold_border;

	&.active {
		z-index: 10;
	}

	&:hover:before {
		background-color: color.adjust(colors.$black, $lightness: +5%);
	}

	> input {
		color: inherit;
		border: none;
		outline: none;
		background: none;
		width: 100%;
		height: 100%;
		padding: 0.5em;
		box-sizing: border-box;
		border-radius: inherit;
	}

	> img {
		position: absolute;
		display: block;
		inset: 0 0.5em 0 auto;
		margin: auto 0;
		height: 65%;
	}

	> ul {
		display: none;
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

		&.active {
			display: block
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

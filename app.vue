<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Auth from '@/components/auth.vue'

const menu_active = ref(false)
const nav_menu = ref<HTMLElement>()
const nav_bar = ref<HTMLElement>()

const current_route = computed<string>(() => {
	switch (useRoute().name) {
		case 'quotes':
			return 'Zitate'
		case 'gallery':
			return 'Gallerie'
		case 'rankings':
			return 'Rankings'
		default:
			return ''
	}
})

const requires_authentication = computed<boolean>(() => {
	const route_name = useRoute().name?.toString() ?? ''

	const auth_routes = [
		'rankings',
		'quotes',
		'gallery'
	]

	for (const route of auth_routes) {
		if (route_name.startsWith(route))
			return true
	}

	return false
})

function out_of_menu_click(this: Window, ev: WindowEventMap['click']) {
	if (!(ev.target instanceof HTMLElement))
		return

	if (
		!nav_menu.value?.contains(ev.target) &&
		!nav_bar.value?.contains(ev.target)
	)
		menu_active.value = false
}

watch(menu_active, val => {
	if (val)
		window.addEventListener('click', out_of_menu_click)
	else
		window.removeEventListener('click', out_of_menu_click)
})
</script>

<template>
	<nav class='bar' ref='nav_bar' :class='{ hidden: menu_active }'>
		<router-link to='/' @click='menu_active = false'>abi 2022</router-link>
		<p>{{ current_route }}</p>
		<img src='@/assets/menu.svg' alt='menu' @click='menu_active = true'/>
	</nav>

	<nav class='menu' ref='nav_menu' :class='{ hidden: !menu_active }'>
		<router-link to='/quotes' @click='menu_active = false'>Zitate</router-link>
		<router-link to='/gallery' @click='menu_active = false'>Gallerie</router-link>
		<router-link to='/rankings' @click='menu_active = false'>Rankings</router-link>
	</nav>

	<Auth v-if='requires_authentication'>
		<router-view/>
	</Auth>
	<router-view v-else/>
</template>

<style lang='scss'>
@use '@/assets/scss/colors.scss';
@use '@/assets/scss/fonts.scss';
@use '@/assets/scss/mixins.scss';
@use 'sass:color';

$navbar-height: 3.125rem;

html {
	background-color: colors.$black;
}

body {
	margin: 0;
	font-family: fonts.$text;
}

h1, h2, h3, h4, h5, h6 {
	background: linear-gradient(
		90deg, 
		colors.$primary 25%,
		color.adjust(colors.$primary, $lightness: +15%) 50%,
		colors.$primary 75%,
	);
	background-clip: text;
	-webkit-background-clip: text;
	color: transparent;
	font-family: fonts.$heading;
	text-align: center;
}


#app {
	color: colors.$white;
	font-family: fonts.$text, Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;

	> nav.bar {
		display: flex;
		position: sticky;
		z-index: 420;
		inset: 0 0 auto 0;
		height: $navbar-height;
		padding: 0.8rem;
		box-sizing: border-box;
		transition: transform 0.5s ease-in-out;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 0 2rem colors.$black;
		background: linear-gradient(
			90deg,
			colors.$secondary 0%,
			colors.$primary 25%,
			colors.$primary 75%,
			colors.$secondary 100%
		);

		&.hidden {
			transform: translateY(-100%);
		}

		> a {
			@include mixins.link;
			font-size: 1.25rem;
		}

		> p {
			font-family: fonts.$heading;
			font-size: 1.2rem;
		}

		> img {
			cursor: pointer;
			filter: drop-shadow(0 0 1em colors.$black);
			height: $navbar-height;
			width: $navbar-height;

			&:hover {
				filter: drop-shadow(0 0 1em colors.$grey);
			}
		}
	}

	> nav.menu {
		position: fixed;
		z-index: 420;
		display: flex;
		flex-direction: column;
		padding: 1em;
		gap: 1em;
		top: 0;
		right: 0;
		width: 25ch;
		height: 100vh;
		background: linear-gradient(
			90deg,
			colors.$primary 0%,
			colors.$secondary 100%
		);
		transition: transform 0.5s ease-in-out;
		box-shadow: 0 0 5rem colors.$black;

		&.hidden {
			transform: translateX(100%);
		}

		> a {
			@include mixins.link;
			font-size: 1.25rem;

			&:before {
				content: '» ';
				vertical-align: 0.125em;
			}
		}
	}

	> article {
		background-color: colors.$dark-grey;
		max-width: 75ch;
		min-height: 100vh;
		margin: -$navbar-height auto 0 auto;
		padding: calc($navbar-height + 1rem) 1rem 1rem 1rem;
		box-sizing: border-box;
		box-shadow: 0 0 2.5rem color.scale(colors.$dark-grey, $lightness: +10%);
		border-width: 2px;
		border-style: none solid;
		border-image-slice: 1;
		border-image-source: linear-gradient(
			180deg, 
			colors.$secondary 0%,
			colors.$primary 50%,
			colors.$secondary 100%
		);

		> *:first-child {
			margin-top: 0;
		}
	}
}
</style>

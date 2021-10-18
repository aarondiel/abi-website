<script lang='ts'>
import { ref } from 'vue'
import type { Ref } from 'vue'

function route_name(route: string): string {
	switch(route) {
		case 'quotes':
			return 'Zitate'
		case 'gallery':
			return 'Gallerie'
		default:
			return ''
	}
}

export default {
	setup() {
		const nav_bar: Ref<HTMLElement | undefined> = ref()
		const nav_menu: Ref<HTMLElement | undefined> = ref()
		let menu_active = false

		function out_of_menu_click(this: Window, ev: WindowEventMap['click']) {
			if (nav_menu.value === undefined)
				return

			if (ev.x < (this.innerWidth - nav_menu.value.clientWidth))
				toggle_menu()
		}

		function toggle_menu(): void {
			if (nav_bar.value === undefined || nav_menu.value === undefined)
				return

			menu_active = !menu_active

			nav_bar.value.classList.toggle('hidden')
			nav_menu.value.classList.toggle('hidden')

			if (menu_active)
				window.addEventListener('click', out_of_menu_click)
			else
				window.removeEventListener('click', out_of_menu_click)
		}

		return { route_name, toggle_menu, nav_bar, nav_menu }
	}
}
</script>

<template>
	<main class='app'>
		<Head>
			<Title>abi 2022</Title>
		</Head>

		<nav class='bar' ref='nav_bar'>
			<router-link to='/'>abi 2022</router-link>

			<p>{{ route_name($route.name) }}</p>

			<svg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' @click='toggle_menu'>
				<path fill-rule='evenodd' clip-rule='evenodd' d='
					M25 35.5
					C25 34.1193 26.1193 33 27.5 33
					H72.5
					C73.8807 33 75 34.1193 75 35.5
					C75 36.8807 73.8807 38 72.5 38
					H27.5
					C26.1193 38 25 36.8807 25 35.5
					Z

					M25 50.5
					C25 49.1193 26.1193 48 27.5 48
					H72.5
					C73.8807 48 75 49.1193 75 50.5
					C75 51.8807 73.8807 53 72.5 53
					H27.5
					C26.1193 53 25 51.8807 25 50.5
					Z

					M75 65.5
					C75 64.1193 73.8807 63 72.5 63
					H27.5
					C26.1193 63 25 64.1193 25 65.5
					C25 66.8807 26.1193 68 27.5 68
					H72.5
					C73.8807 68 75 66.8807 75 65.5
					Z
				'/>
			</svg>
		</nav>

		<nav class='menu hidden' ref='nav_menu'>
			<router-link to='/gallery'>Gallerie</router-link>
			<router-link to='/quotes'>Zitate</router-link>
			<router-link to='/rankings'>Rankings</router-link>
		</nav>

		<NuxtPage/>
	</main>
</template>

<style lang='scss'>
	@use '@/assets/scss/colors.scss';
	@use '@/assets/scss/fonts.scss';
	@use 'sass:color';

	$navbar-height: 3.125rem;

	html {
		background-color: colors.$black;
	}

	body {
		margin: 0;
		color: colors.$white;
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
		color: transparent;
		font-family: fonts.$heading;
		font-size: 2.5em;
		text-align: center;
	}

	br {
		display: block;
		margin-top: 0.75em;
	}

	a {
		color: colors.$light-grey;
		font-family: fonts.$heading;
		text-decoration: none;
		text-shadow: 0 0 1em colors.$black;

		&:hover {
			color: colors.$white;
			text-shadow: 0 0 1em colors.$grey;
		}
	}

	.app {
		> nav.bar {
			display: flex;
			position: sticky;
			top: 0;
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
				font-size: 1.25rem;
			}

			> p {
				font-family: fonts.$heading;
				font-size: 1.2rem;
			}

			> svg {
				cursor: pointer;
				fill: colors.$light-grey;

				filter: drop-shadow(0 0 1em colors.$black);
				height: $navbar-height;
				width: $navbar-height;

				&:hover {
					fill: colors.$white;
					filter: drop-shadow(0 0 1em colors.$grey);
				}
			}
		}

		> nav.menu {
			position: fixed;
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

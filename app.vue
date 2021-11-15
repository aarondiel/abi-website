<script setup lang='ts'>
	const nav_menu = ref<HTMLElement>()
	const menu_active = ref<boolean>(false)
	const route_name = computed<string>(() => {
		const route = useRoute().name

		switch (route) {
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

	// currently app.vue cannot be converted into a async component
	// therefore, please switch this out to:
	// const { data: user } = await useAsyncData('user', async () => {
	// at some future point
	const user = useAsyncData('user', async () => {
		try {
			const token = useNuxtApp().$token()

			// cookies don't get forwarded from the server
			// removing express might fix this crude workaround
			const response = await $fetch(
				'http://localhost:3000/api/auth',
				{ method: 'GET', headers: { authorization: `Bearer ${ token }` } }
			)

			return response
		} catch (err) {
			// this is really scuffed
			// this should be updated once nuxt3 supports axios
			const error_code = err.message.split(' ')[0]

			return { error_code }
		}
	})

	function out_of_menu_click(this: Window, ev: WindowEventMap['click']) {
		if (!(ev.target instanceof HTMLElement))
			return

		if (!nav_menu.value?.contains(ev.target))
			menu_active.value = false
	}

	watch(menu_active, val => {
		if (val)
			window.addEventListener('click', out_of_menu_click)
		else
			window.removeEventListener('click', out_of_menu_click)
	})

	provide('user', user)
</script>

<template>
	<main class='app'>
		<nav class='bar' :class='{ hidden: menu_active }'>
			<NuxtLink @click='menu_active = false' to='/'>abi 2022</NuxtLink>

			<p>{{ route_name }}</p>

			<svg @click='menu_active = true' width='100' height='100' viewBox='0 0 100 100'>
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

		<nav class='menu' :class='{ hidden: !menu_active }' ref='nav_menu'>
			<NuxtLink @click='menu_active = false' to='/gallery'>Gallerie</NuxtLink>
			<NuxtLink @click='menu_active = false' to='/quotes'>Zitate</NuxtLink>
			<NuxtLink @click='menu_active = false' to='/rankings'>Rankings</NuxtLink>
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

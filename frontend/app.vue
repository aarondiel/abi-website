<script lang='ts'>
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
		return { route_name }
	}
}
</script>

<template>
	<main class='app'>
		<Head>
			<Title>abi 2022</Title>
		</Head>

		<nav>
			<router-link to='/'>
				abi 2022
			</router-link>

			<p>{{ route_name($route.name) }}</p>

			<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
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
		<NuxtPage/>
	</main>
</template>

<style lang='scss'>
	@use '@/assets/scss/colors.scss';
	@use '@/assets/scss/fonts.scss';

	html {
		background-color: colors.$black;
	}

	body {
		margin: 0;
		font-family: fonts.$text;
	}

	.app {
		> nav {
			display: flex;
			justify-content: space-between;
			align-items: center;
			background: linear-gradient(
				90deg,
				colors.$secondary 0%,
				colors.$primary 25%,
				colors.$primary 75%,
				colors.$secondary 100%
			);

			height: 3.125rem;
			padding: 0.8rem;
			box-sizing: border-box;

			> a {
				font-size: 1.25rem;
				color: colors.$light-grey;
				font-family: fonts.$heading;
				text-decoration: none;
				text-shadow: 0 0 1em colors.$black;

				&:hover {
					color: colors.$white;
					text-shadow: 0 0 1em colors.$dark-grey;
				}
			}

			> p {
				color: white;
			}

			> svg {
				fill: colors.$light-grey;
				filter: drop-shadow(0 0 1em colors.$black);
				height: 3.125rem;

				&:hover {
					fill: colors.$white;
					filter: drop-shadow(0 0 1em colors.$dark-grey);
				}
			}
		}
	}
</style>

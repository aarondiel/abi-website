<template>
	<nav class='bar' ref='nav'>
		<router-link to='/'>abi 2022</router-link>
		<p ref='currentRoute'></p>
		<img
			src='./assets/menu.svg'
			alt='menu button'
			@click='toggleMenu'
		/>
	</nav>

	<nav class='menu hidden' ref='menu'>
		<img src='./assets/cross.svg' alt='close' @click='toggleMenu'/>
		<router-link to='/gbr'>GbR Vertrag</router-link>
	</nav>

	<article>
		<router-view/>

		<footer>
			<p>a website designed and written by aaron diel</p>
		</footer>
	</article>
</template>

<script>
import { ref } from 'vue';

export default {
	name: 'App',

	setup() {
		const nav = ref(null);
		const menu = ref(null);

		const toggleMenu = () => {
			nav.value.classList.toggle('hidden');
			menu.value.classList.toggle('hidden');
		}

		return {
			nav,
			menu,
			toggleMenu
		};
	},

	watch: {
		$route(to) {
			let name = '';

			switch (to.fullPath) {
				case '/':
					name = ''
					break

				case '/gbr':
					name = 'GbR Vertrag'
					break
			}

			this.$refs.currentRoute.innerText = name;
		}
	},
}
</script>

<style lang='scss'>
@use './scss/colors';
@use './scss/fonts';
@use './scss/media';

body {
	margin: 0;
	overflow-x: hidden;
}

#app {
	font-family: fonts.$text;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	min-height: 100vh;
}

article {
	display: flex;
	box-sizing: border-box;
	flex-direction: column;
	align-items: flex-start;
	box-shadow: 0 0.25rem 0.5rem #000000;
	max-width: map-get(media.$breakpoints, tablet);
	min-height: 100vh;
	padding-top: 3.125rem;
	margin: 0 auto;

	footer {
		margin: 0 1rem;
		font-size: 0.75rem;
	}
}

nav {
	position: absolute;
	background-color: colors.$primary;
	color: #ffffff;
	display: flex;
	box-shadow: 0 0.125rem 0.75rem #000000;

	> img {
		cursor: pointer;
	}

	> a {
		color: #ffffff;
		text-decoration: none;
		text-shadow: 0 2px 2px #000000;

		&:hover {
			color: colors.$grey;
		}
	}
}

nav.bar {
	width: 100%;
	height: 3.125rem;
	justify-content: space-between;
	align-items: center;
	font-size: 1.25rem;
	transition: transform 0.25s ease-in-out;

	&.hidden {
		transform: translateY(-100%);
	}

	> * {
		margin: 0 1rem;
	}

	img {
		height: 25px;
	}
}

nav.menu {
	z-index: 100;
	position: fixed;
	flex-direction: column;
	align-items: flex-start;
	height: 100vh;
	width: 100vw;
	top: 0;
	right: 0;
	transition: transform 0.5s ease-in-out;
	padding-left: 1rem;

	@include media.tablet() {
		width: 50vw;
	}

	&.hidden {
		transform: translateX(100%);
	}

	> a {
		font-size: 1.5rem;
	}

	> * + * {
		margin-top: 0.5rem;
	}

	> img {
		height: 2rem;
		margin-top: 1rem;
	}
}
</style>

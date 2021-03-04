<template>
	<nav>
		<router-link to="/">abi 2022</router-link>
		<p ref="currentRoute"></p>
		<img src="./assets/menu.svg" alt="menu button"/>
	</nav>
	<article>
		<router-view/>
	</article>
</template>

<script>
export default {
	name: 'App',
	watch: {
		$route(to) {
			let name = '';
			switch(to.fullPath) {
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

<style lang="scss">
@use './scss/colors';
@use './scss/fonts';
@use './scss/breakpoints';

body {
	margin: 0;
	height: 100vh;
}

#app {
	font-family: fonts.$text;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	height: 100%;
}

article {
	display: flex;
	box-shadow: 2px 2px 4px #000000;
	max-width: breakpoints.$tablet;
	height: calc(100% - 50px);
	justify-content: center;
	margin: 0 auto;
}

nav {
	width: 100%;
	height: 50px;
	background-color: colors.$primary;
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: #ffffff;
	font-size: 1.25rem;
	box-shadow: 0 2px 8px #000000;

	> * {
		margin: 0 1rem;
	}

	a {
		/*abi 2022*/
		color: #ffffff;
		text-decoration: none;
		text-shadow: 0 2px 2px #000000;
		&:hover {
			color: colors.$secondary;
		}
	}

	img {
		height: 25px;
	}
}
</style>

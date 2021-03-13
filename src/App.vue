<template>
	<nav>
		<router-link to="/">abi 2022</router-link>
		<p ref="currentRoute"></p>
		<img src="./assets/menu.svg" alt="menu button"/>
	</nav>
	<article>
		<router-view/>
		<footer>
			<p>a website designed and written by aaron diel</p>
		</footer>
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
	flex-direction: column;
	align-items: flex-start;
	box-shadow: 2px 2px 4px #000000;
	max-width: breakpoints.$tablet;
	min-height: calc(100vh - 50px);
	margin: 0 auto;

	footer {
		margin: 0 1rem;
		font-size: 0.75rem;
	}
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
			color: colors.$grey;
		}
	}

	img {
		height: 25px;
	}
}
</style>

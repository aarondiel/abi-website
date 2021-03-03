<template>
	<nav>
		<router-link to="/">abi 2022</router-link>
		<p ref="currentRoute"></p>
		<img src="./assets/menu.svg" alt="menu button"/>
	</nav>
	<router-view/>
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

@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500&display=swap');
$text: 'Roboto Mono', monospace;
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300&display=swap');
$heading: 'Oswald', sans-serif;
@import url('https://fonts.googleapis.com/css2?family=Amatic+SC:wght@700&display=swap');
$cursive: 'Amatic SC', cursive;

$primary: #1E1532;
$secondary: #675C80;
$grey: red;

body {
	margin: 0;
}

#app {
	font-family: $text;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
}

nav {
	width: 100%;
	height: 50px;
	background-color: $primary;
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
			color: $secondary;
		}
	}

	img {
		height: 25px;
	}
}
</style>

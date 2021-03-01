<template>
	<nav>
		<router-link to="/abi/gbr">Gbr Vertrag</router-link>
		<router-link to="/">Mottos</router-link>
	</nav>
	<router-view/>
</template>

<script>
export default {
	name: 'App'
}
</script>

<style lang="scss">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

nav {
	width: 100%;
	display: flex;
	justify-content: center;
	justify-items: center;

	a {
		padding: 0 2rem;
		font-weight: bold;
		font-size: 2rem;
		color: #2c3e50;

		&:hover {
			color: grey;
		}

		&.router-link-exact-active {
			color: #42b983;
		}
	}
}
</style>

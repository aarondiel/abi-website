<template>
	<Parallax :fixed=true></Parallax>
</template>

<script>
import Parallax from './components/Parallax.vue'

export default {
	name: 'App',
	components: {
		Parallax
	}
}
</script>

<style>
body {
	margin: 0;
}

#app {
	margin: 2em;
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
}
</style>

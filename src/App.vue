<template>
	<Parallax class='banner'>
		<img src='./assets/banner.jpg'>
	</Parallax>
	<h1>abi 2022</h1>
	<Parallax class='banner'>
		<img src='./assets/vote-banner.jpg'>
	</Parallax>
	<h1>Mottos</h1>
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

<style lang='scss'>
$background: #272727;
$foreground: #ebdbb2;
$selection_foreground: #655b53;
$selection_background: #ebdbb2;
$url_color: #d65c0d;
$shadow: #000000;

$black: #272727;
$red: #cc231c;
$green: #989719;
$yellow: #d79920;
$blue: #448488;
$magenta: #b16185;
$cyan: #689d69;
$white: #a89983;
$bright-black: #928373;
$bright-red: #fb4833;
$bright-green: #b8ba25;
$bright-yellow: #fabc2e;
$bright-blue: #83a597;
$bright-magneta: #d3859a;
$bright-teal: #8ec07b;
$bright-white: #ebdbb2;

@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap');
$text: 'Source Code Pro', monospace;
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300&display=swap');
$heading: 'Oswald', sans-serif;
@import url('https://fonts.googleapis.com/css2?family=Amatic+SC:wght@700&display=swap');
$cursive: 'Amatic SC', cursive;

html {
	background-color: $background;
}

body {
	margin: 0;
}

h1, h2, h3, h4, h5, h6 {
	margin: 0;
	font-family: $heading;
	font-weight: 5rem;
	text-shadow: 0 5px 10px $shadow;
}

#app {
	width: 100%;
	height: 300vh;
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #ffffff;
}

.banner {
	clip-path: polygon(0 0, 100% 0%, 100% 75%, 0 100%);
	filter: drop-shadow(0 2.5px 10px $shadow);
	height: 70vh;

	&:not(:first-of-type) {
		z-index: -5;
		transform: translateY(-25%);
		clip-path: polygon(0 0, 100% 0%, 100% 100%, 0 75%);
	}

	+ h1 {
		position: absolute;

		&:first-of-type {
			font-size: 10rem;
			left: 50%;
			transform: translate(-60%, -50vh);
		}

		&:not(:first-of-type) {
			font-size: 8rem;
			right: 25%;
			transform: translate(50%, -65vh);
		}
	}
}
</style>

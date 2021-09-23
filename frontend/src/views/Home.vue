<template>
	<div class='home'>
		<p>Willkommen auf der Abi-Webseite, hier findest du verschiedene Abstimmungen, Infos zu Veranstaltungen und Sonstiges betrefflich des Abis.</p>

		<router-link to='/gallery'>Abi Gallerie</router-link>
		<router-link to='/gbr'>GbR Vertrag Abstimmung</router-link>
		<router-link to='/quotes'>Zitate</router-link>
	</div>
</template>

<script>
export default {
	name: 'Home'
}
</script>

<style lang='scss'>
.home {
	width: 100%;
	display: flex;
	box-sizing: border-box;
	align-items: center;
	flex-direction: column;
	padding: 1rem 1rem 0 1rem;

	p {
		margin-bottom: 1.5rem;
	}
}
</style>

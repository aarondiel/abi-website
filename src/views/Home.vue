<template>
	<div class='home'>
		<h1>home: wip</h1>
		<Collapsible :toggled='true'>i hate this</Collapsible>
		<router-link to='/gbr'>GbR Vertrag</router-link>
	</div>
</template>

<script>
import Collapsible from '../components/Collapsible';

export default {
	name: 'Home',
	components: {
		Collapsible
	}
};
</script>

<style lang='scss' scoped>
.home {
	text-align: center;
}
</style>

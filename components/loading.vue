<script setup lang='ts'>
const props = defineProps<{
	loading: boolean
}>()
</script>

<template>
	<p class='loading' v-if='props.loading'>loading...</p>
	<slot v-else/>
</template>

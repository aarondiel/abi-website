<script setup lang='ts'>
import { defineProps } from 'vue'
import type { Ref } from 'vue'

const props = defineProps<{
	loading: Ref<boolean>
}>()
</script>

<template>
	<p class='loading' v-if='props.loading'>loading...</p>
	<slot v-else/>
</template>

<style lang='scss'>
</style>

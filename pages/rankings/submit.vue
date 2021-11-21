<script setup lang='ts'>
import { frontend_config as config } from '@/config'

async function get_suggestions() {
	const response = await Promise.all([
		fetch(`${ config.url }/api/teachers`),

		fetch(`${ config.url}/api/users`, {
			credentials: 'include'
		})
	])

	if (!response.every(v => v.ok))
		return
	
	const [ teachers, users ] = await Promise.all(
		response.map(v => v.json())
	)

	console.log(teachers, users)
}
</script>

<template>
	<article class='rankings'>
		currently not available
	</article>
</template>

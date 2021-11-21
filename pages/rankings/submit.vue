<script setup lang='ts'>
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
}
</script>

<template>
</template>

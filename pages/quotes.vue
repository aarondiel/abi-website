<script setup lang='ts'>

const quotes = await useFetch('http://localhost:3000/api/quotes', { method: 'GET' } )

const error_code = quotes.error.value?.message?.split(' ')[0]

console.log(error_code)
console.log(useNuxtApp())
</script>

<template>
	<article class='quotes'>
		<Head>
			<Title>abi zitate</Title>
		</Head>
	</article>
</template>

<script setup lang='ts'>
const quotes = await useFetch('http://localhost:3000/api/quotes', { method: 'GET' } )

// try to get error code out of this mess
console.table(quotes.error.value.message)
</script>

<template>
	<article class='quotes'>
		<Head>
			<Title>abi zitate</Title>
		</Head>
	</article>
</template>

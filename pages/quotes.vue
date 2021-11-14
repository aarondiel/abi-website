<script setup lang='ts'>
// const quotes = await useFetch('http://localhost:3000/api/quotes', { method: 'GET' } )

const router = useRouter()
const route = useRoute()
const user = await inject('user')
console.log(user.data.value)

async function redirect() {
	await router.push({ name: 'login', query: { ...route.query, redirected_from: 'quotes' } })
}
</script>

<template>
	<article class='quotes'>
		<p>zitate temporär geschlossen</p>

		<button @click='redirect'>redirect</button>
	</article>
</template>

<script setup lang='ts'>
import { ref, inject, onMounted, onUnmounted } from 'vue'
import { frontend_config as config } from '@/config'
import Loading from '@/components/loading.vue'

const images = ref(new Set<any>())
const loading = ref(false)
const limit = ref(3 * 10)
const page = ref(-1)
const loader = ref<HTMLSpanElement>()
const user: any = inject('user')
let observer: IntersectionObserver

function url(id: string) {
	return `${ config.url }/api/gallery/${ id }`
}

async function get_images() {
	loading.value = true

	const response = await fetch(`${ config.url }/api/gallery?limit=${ limit.value }&offset=${ limit.value * page.value }`, {
		credentials: 'include'
	})

	if (!response.ok)
		return

	const data: any[] = await response.json()

	data.forEach(v => images.value.add(v))
	loading.value = false
}

function handle_intersection(entry: IntersectionObserverEntry) {
	if (entry.intersectionRatio === 0)
		return
	
	page.value += 1
	get_images()
}

onMounted(() => {
	if (loader.value === undefined)
		return

	observer = new IntersectionObserver(entries => {
		if (loading.value)
			return

		entries.forEach(handle_intersection)
	})

	observer.observe(loader.value)
})

onUnmounted(() => {
	if (observer === undefined)
		return
	
	observer.disconnect()
})
</script>

<template>
	<article class='gallery'>
		<div v-for='image in images' :key='image._id'>
			<img :src='url(image.thumbnail300)'/>
			<p v-if='user.privileges.includes("admin")'>- {{ image.submitted_by }}</p>
		</div>

		<Loading :loading='loading'/>
		<span ref='loader'/>
	</article>
</template>

<style lang='scss'>
.gallery {
	width: 100%;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-auto-rows: min-content;

	> div {
		> img {
			max-width: 100%;
		}

		> p {
			text-align: right;
		}
	}

	> span {
		height: 2.5rem;
	}
}
</style>

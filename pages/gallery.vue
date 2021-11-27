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
			<span><img :srcset='`
				${ url(image.thumbnail300) } 300w,
				${ url(image.thumbnail600) } 600w,
				${ url(image.image) }
			`'/></span>
			<p v-if='user.privileges.includes("admin")'>- {{ image.submitted_by }}</p>
		</div>

		<Loading :loading='loading'/>
		<span ref='loader'/>
	</article>
</template>

<style lang='scss'>
@use '@/assets/scss/colors.scss';
@use '@/assets/scss/mixins.scss';
@use '@/assets/scss/media.scss';

.gallery {
	width: 100%;
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	gap: 1rem;
	justify-items: center;

	@include media.phone() {
		grid-template-columns: repeat(3, 1fr);
	}

	> div {
		> span {
			@include mixins.gold_border;

			display: block;
			max-width: 100%;
			box-shadow: 0 0.25rem 0.5rem colors.$black;

			> img {
				display: block;
				max-width: calc(100% - 4px);
				border-radius: inherit;
				padding: 2px;
			}
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

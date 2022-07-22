<script setup lang='ts'>
import { ref, inject, onMounted, onUnmounted } from 'vue'
import { frontend_config as config } from '@/config'
import Loading from '@/components/loading.vue'
import Modal from '@/components/modal.vue'

interface Image {
	_id: string,
	image: string,
	thumbnail300: string,
	thumbnail600: string,
	format: 'image/webp' | 'video/webm',
	submitted_by: string
}

const files = ref(new Set<any>())
const loading = ref(false)
const limit = ref(3 * 10)
const page = ref(-1)
const loader = ref<HTMLSpanElement>()
const popup_image = ref({ active: false, image: {} as Image })
const user: any = inject('user')
let observer: IntersectionObserver

function url(id: string) {
	return `${ config.url }/api/gallery/${ id }`
}

async function get_files() {
	loading.value = true

	const response = await fetch(`${ config.url }/api/gallery?limit=${ limit.value }&offset=${ limit.value * page.value }`, {
		credentials: 'include'
	})

	if (!response.ok)
		return

	const data: any[] = await response.json()

	data.forEach(v => files.value.add(v))
	loading.value = false
}

function handle_intersection(entry: IntersectionObserverEntry) {
	if (entry.intersectionRatio === 0)
		return
	
	page.value += 1
	get_files()
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
		<router-link to='/gallery/submit'>→ Bilder einreichen</router-link>

		<div class='image' v-for='file in files' :key='file._id'>
			<span>
				<img
					v-if='file.format === "image/webp"'
					type='image/webp'
					:srcset='`
						${ url(file.thumbnail300) } 300w,
						${ url(file.thumbnail600) } 600w,
						${ url(file.image) }
					`'
					alt='gallery_image'
					@click='popup_image = { active: true, image: file }'
				/>
				<video v-else-if='file.format === "video/webm"' controls>
					<source :src='url(file.thumbnail300)' type='video/webm' media='all and (max-width: 300px)'/>
					<source :src='url(file.thumbnail600)' type='video/webm' media='all and (max-width: 600px)'/>
					<source :src='url(file.image)' type='video/webm'/>
				</video>
			</span>

			<p v-if='user.privileges.includes("admin")'>
				- {{ file.submitted_by }}
			</p>
		</div>

		<Modal
			v-model:active='popup_image.active'
			type='popup'
		>
			<img
				v-if='popup_image.image.format === "image/webp"'
				:srcset='`
					${ url(popup_image.image.thumbnail300) } 300w,
					${ url(popup_image.image.thumbnail600) } 600w,
					${ url(popup_image.image.image) }
				`'
				alt='gallery_image'
				/>
				<video v-else-if='popup_image.image.format === "video/webm"'>
					<source :src='url(popup_image.image.thumbnail300)' type='video/webm' media='all and (max-width: 300px)'/>
					<source :src='url(popup_image.image.thumbnail600)' type='video/webm' media='all and (max-width: 600px)'/>
					<source :src='url(popup_image.image.image)' type='video/webm'/>
				</video>
		</Modal>

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
	grid-template-columns: 1fr;
	grid-template-rows: min-content;
	gap: 1rem;
	justify-items: center;

	@include media.tablet() {
		grid-template-columns: repeat(3, 1fr);
	}

	> a {
		color: inherit;
		text-align: right;
		display: block;
		width: 100%;
		height: 1rem;

		@include media.tablet() {
			grid-column: span 3;
		}
	}

	> .image {
		> span {
			@include mixins.gold_border;

			display: block;
			max-width: 100%;
			box-shadow: 0 0.25rem 0.5rem colors.$black;

			> img, video {
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

	> .modal img[alt='gallery_image'] {
		display: block;
		max-width: 80vw;
		max-height: 80vh;
	}

	> span {
		height: 2.5rem;
	}
}
</style>

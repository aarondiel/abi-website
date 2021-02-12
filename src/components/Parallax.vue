<template>
	<div class="parallax-wrapper" ref="block">
		<div
			:class="['is-parallax', fixed ? 'is-fixed': '']"
			ref="parallax"
		>
			<slot/>
		</div>
	</div>
</template>

<script>
import { ref, onUnmounted } from 'vue'

export default {
	name: 'Parallax',
	props: {
		speedFactor: {
			default: 0.15,
			type: Number
		},
		fixed: {
			default: false,
			type: Boolean
		}
	},

	setup(props) {
		const block = ref(null)
		const parallax = ref(null)

		const scrollHandler = () => {
			const rect = parallax.value.getBoundingClientRect()

			if (!(
				rect.bottom >= 0 &&
				rect.top <= window.innerHeight
			)) {
				return
			}

			window.requestAnimationFrame(() => {
				const parentHeight = block.value.offsetHeight
				const parallaxHeight = parallax.value.offsetHeight
				const availableOffset = parallaxHeight - parentHeight
				let animationValue = (window.pageYOffset * props.speedFactor)

				if (animationValue <= availableOffset && animationValue >= 0) {
					parallax.value.style.transform = `translateY(${-animationValue}px)`
				}
			})
		}

		if (!props.fixed) {
			window.addEventListener('scroll', scrollHandler)
		}

		onUnmounted(() => {
			if (!props.fixed) {
				window.removeEventListener('scroll', scrollHandler)
			}
		})

		return { parallax, block }
	},
}
</script>

<style lang="scss">
.parallax-wrapper {
	position: relative;
	/*clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);*/
	height: 100vh;
	scroll-behavior: smooth;
	overflow: hidden;
	z-index: -1;

	.is-parallax {
		width: 100%;
		height: 120%;
		overflow: hidden;

		position: absolute;
		top: 0;
		left: 0;
		right: 0;

		will-change: transform;

		> * {
			height: 100%;
			width: 100%;
			max-width: none;
			object-fit: cover;
			object-position: top;
		}

		&.is-fixed {
			position: fixed;

			> img {
				height: 100vh;
			}
		}
	}
}
</style>

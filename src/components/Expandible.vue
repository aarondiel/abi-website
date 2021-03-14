<template>
	<transition
		name='expand'
		@enter='enter'
		@after-enter='afterEnter'
		@leave='leave'
	>
		<slot/>
	</transition>
</template>

<script>
export default {
	name: 'Expandible',
	methods: {
		enter(el) {
			const width = getComputedStyle(el).width;

			el.style.width = width;
			el.style.position = 'absolute';
			el.style.visibility = 'hidden';
			el.style.height = 'auto';

			const height = getComputedStyle(el).height;

			el.style.width = null;
			el.style.position = null;
			el.style.visibility = null;
			el.style.height = 0;

			// Force repaint to make sure the
			// animation is triggered correctly.
			getComputedStyle(el).height;

			// Trigger the animation.
			// We use `requestAnimationFrame` because we need
			// to make sure the browser has finished
			// painting after setting the `height`
			// to `0` in the line above.
			requestAnimationFrame(() => {
				el.style.height = height;
			});
		},

		afterEnter(el) {
			el.style.height = 'auto';
		},

		leave(el) {
			const height = getComputedStyle(el).height;
			
			el.style.height = height;

			// Force repaint to make sure the
			// animation is triggered correctly.
			getComputedStyle(el).height;

			requestAnimationFrame(() => {
				el.style.height = 0;
			});
		}
	}
};
</script>

<style scoped>
* {
	will-change: height;
	transform: translateZ(0);
	backface-visibility: hidden;
	perspective: 1000px;
}

.expand-enter-active, .expand-leave-active {
	transition: height 0.5s ease-in-out;
	overflow: hidden;
}

.expand-enter-from, .expand-leave-to {
	height: 0;
}
</style>

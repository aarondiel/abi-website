<template>
	<transition
		name='expand'
		class='optimize'
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

			// force repaint to make sure the animation is triggered correctly
			getComputedStyle(el).height;

			// trigger the animation using 'requestAnimationFrame'
			// this is done to make sure that the browser has finished painting
			// after setting the 'height' to '0' in the line above
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

			// force repaint to make sure the animation is triggered correctly
			getComputedStyle(el).height;

			requestAnimationFrame(() => {
				el.style.height = 0;
			});
		}
	}
};
</script>

<style scoped>
.optimize {
	will-change: height;
	backface-visibility: hidden;
}

.expand-enter-active, .expand-leave-active {
	transition: height 0.5s ease-in-out;
	overflow: hidden;
}

.expand-enter-from, .expand-leave-to {
	height: 0;
}
</style>

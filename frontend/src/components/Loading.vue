<script>
import { ref } from 'vue'

export default {
	name: 'Loading',
	setup() {
		const is_loading = ref(false)

		function set_loading(state) {
			if (state === -1)
				return is_loading.value = !is_loading.value

			if (state === 0 || state === 1)
				return is_loading.value = state
		}

		return { is_loading, set_loading }
	}
}
</script>

<template>
	<div class='loading'>
		<svg
			v-if='is_loading'
			class='loading'
			width="100"
			height="25"
			fill="none"
		>
			<circle cx="17.5" cy="12.5" r="7.5"/>
		</svg>
		<slot v-else/>
	</div>
</template>

<style lang='scss'>
@use '@/scss/colors';

@keyframes boing {
	0% {
		fill: colors.$secondary;
		transform: translateX(0);
	}

	50% {
		fill: colors.$primary;
		transform: translateX(65%);
	}

	100% {
		fill: colors.$secondary;
		transform: translateX(0);
	}
}

svg.loading {
	aspect-ratio: 1/1;

	> circle {
		top: 0;
		animation: boing 1.5s ease-in-out infinite;
	}
}
</style>

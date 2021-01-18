<template>
  <div class="app-wrapper">
    <poll
      title="mottos"
      :data="mottos"
      url="https://schoolvote.vincentscode.de/api/vote"
      :count="-1"
			@submit="getvotes()"
    />
  </div>
</template>

<script>
import Poll from './components/Poll.vue';
import infos from './assets/data.json';
import axios from 'axios';

export default {
  name: 'App',
  components: {
    Poll
  },
  data() {
    return {
      mottos: null
    };
  },
	methods: {
		getvotes() {
			axios.get('https://schoolvote.vincentscode.de/api/vote').then((response) => {
				this.mottos = infos.mottos;
				this.mottos.votes = response.data.length;
				const counts = Object.fromEntries(
					[...response.data.reduce((map, key) => map.set(key, (map.get(key) || 0) + 1), new Map())]
				);
				for (var i = this.mottos.options.length - 1; i >= 0; i--) {
					this.mottos.options[i].votes = counts[this.mottos.options[i].key] ? counts[this.mottos.options[i].key] : 0;
				}
			});
		}
	},
  mounted() {
		this.getvotes();
  }
};
</script>

<style lang='scss'>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@200;500&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Caveat&display=swap');

$phone: 320px;
$tablet: 480px;
$laptop: 770px;
$desktop: 1020px;
$tv: 1200px;

html {
	background-color: #0c0c0d;
	color: #ffffff;

	@media (max-width: $phone) {
		font-size: 0.2rem;
	}

	@media (min-width: $phone) and (max-width: $tablet) {
		font-size: 0.4rem;
	}

	@media (min-width: $tablet) and (max-width: $laptop) {
		font-size: 0.6rem;
	}

	@media (min-width: $laptop) and (max-width: $desktop) {
		font-size: 0.8rem;
	}
}

div.app-wrapper {
	display: grid;
	margin: 5% 5% 0 5%;
	grid-template-columns: minmax(50em, 100em);
	justify-items: center;
	justify-content: center;
}

div.poll-wrapper {
	width: 100%;
}
</style>

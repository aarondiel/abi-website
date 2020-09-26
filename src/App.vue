<template>
  <div class="app-wrapper">
    <poll title="mottos" :data="mottos" :count=-1 />
  </div>
</template>

<script>
import Poll from './components/Poll.vue';
import infos from './assets/data.json'
import axios from 'axios';

export default {
  name: 'App',
  components: {
    Poll
  },
  data() {
    return {
      mottos: null
    }
  },
  mounted () {
    console.log(infos)
    axios.get('https://schoolvote.vincentscode.de/api/vote').then(response => {
        console.log("res", response.data)
        this.mottos = infos.mottos
        this.mottos.votes = response.data.length
        const counts = Object.fromEntries([ ...response.data.reduce((map, key) => map.set(key, (map.get(key) || 0) + 1), new Map()) ]);
        for (var i = this.mottos.options.length - 1; i >= 0; i--) {
          var votes = 0;
          if (counts[this.mottos.options[i].key]) {
            votes = counts[this.mottos.options[i].key];
          }
          this.mottos.options[i].votes = votes
        }
        console.log("mottos", this.mottos)
      })
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@200;500&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Caveat&display=swap');

html {
  background-color: #0c0c0d;
  color: #ffffff;
}

div.app-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 8em;
}
</style>

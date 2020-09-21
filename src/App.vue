<template>
  <div class="poll-wrapper">
    <poll title="mottos" v-bind:data="mottos" display-count=10 />
    <poll title="zitate" data="zitate" display-count=10 />
  </div>
</template>

<script>
import Poll from './components/Poll.vue';
import infos from './assets/data.json'

export default {
  name: 'App',
  components: {
    Poll
  },
  data: function() {
    return {
      mottos: infos.mottos
    }
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

.poll-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 8em;
}
</style>

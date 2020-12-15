<template>
  <div class="poll-wrapper">
    <div class="poll-content">
      <h1>{{ title }}</h1>
      <StatisticBar
        v-for="item in top_options"
        :key="item.key"
				:id="item.key"
        :title="item.title"
        :description="item.description"
        :percent="ratio(item.votes)"
        v-model:selection="selection"
      />
    </div>
    <SubmitMenu 
			:selection="selection"
			url="https://schoolvote.vincentscode.de/api/vote"
		/>
  </div>
</template>

<script>
import StatisticBar from './StatisticBar.vue';
import SubmitMenu from './SubmitMenu.vue';

export default {
  name: 'Poll',
  components: {
    StatisticBar,
    SubmitMenu
  },
  data() {
    return {
      selection: -1
    };
  },
  props: {
    title: String,
    data: Object,
    count: Number
  },
  methods: {
    ratio(votes) {
      return votes / this.data.votes;
    },
  },
  computed: {
    top_options: function() {
      if (!this.data) return null;
      return [...this.data.options]
        .sort((a, b) => {
          return b.votes - a.votes;
        })
        .slice(0, this.count);
    },

    selected: function() {
      return this.selection != -1;
    }
  }
};
</script>

<style scoped lang="scss">
div.poll-wrapper {
	z-index: 0;
}

div.poll-content {
	border: solid 2em #2a2a2e;
	margin: 0;
  padding: 2em 0;
  border-radius: 2em;
  background-color: #2a2a2e;
  height: 70vh;
  overflow-y: scroll;
	scrollbar-width: none;

	h1 {
		margin: 0 0 0.5em 0;
		text-align: center;
		font-family: 'Roboto Mono';
		font-size: 5em;
	}

	&::-webkit-scrollbar {
    width: 0.75rem;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(249, 249, 250, 0.6);
		border-radius: 0.5rem;
  }

  &::-webkit-scrollbar-track {
    display: none;
  }
}
</style>

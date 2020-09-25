<template>
  <div class="poll-wrapper">
    <div class="poll-content">
      <h1 class="poll-title">{{ title }}</h1>
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
    <SubmitMenu :selection="selection" />
		<span>{{ selection }}</span>
    <input id="sendVoteButton" type="submit" @click="doTheVoteThing()" value="Do the vote!" />
  </div>
</template>

<script>
import StatisticBar from './StatisticBar.vue';
import SubmitMenu from './SubmitMenu.vue';
import axios from 'axios';

export default {
  name: 'Poll',
  components: {
    StatisticBar,
    SubmitMenu
  },
  data() {
    return {
      selection: null
    };
  },
  props: {
    title: String,
    data: Object,
    count: Number
  },
  methods: {
    ratio: function(votes) {
      return votes / this.data.votes;
    },
    doTheVoteThing: function() {
      console.log("choiceID:", this.selection);
      axios.post("https://schoolvote.vincentscode.de/api/vote", {
        "userName": "asdf Name",
        "choice": this.selection,
      }).then(response => {
        console.log("then");
        console.log(response.data);
        location.reload();
      }).catch(function (error) {
        console.log("error");
        console.log(error.response.data);
        alert(error.response.data);
      });
    }
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

<style scoped>
div.poll-wrapper {
  margin: 2em 1em 0 2em;
  padding: 2em;
  border-radius: 2em;
  background-color: #2a2a2e;
}

div.poll-content {
  height: 70vh;
  overflow: scroll;
  scrollbar-width: none;
}

h1.poll-title {
  margin: 0 0 0.5em 0;
  text-align: center;
  font-family: 'Roboto Mono';
  font-size: 5em;
}
</style>

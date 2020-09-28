<template>
  <transition name="slide">
    <div class="submit-menu-wrapper" v-if="show">
			<Textfield v-model:text="voteid" name="vote id" />
      <button class="submit-menu-button" @click="submit">submit</button>
      <p id="submit-menu-response"></p>
    </div>
  </transition>
</template>

<script>
import axios from 'axios';
import Textfield from './Textfield.vue'

export default {
  name: 'SubmitMenu',
	components: {
		Textfield
	},
  props: {
    selection: Number,
    url: String,
    colors: {
      type: Object,
      default() {
        return {
          success: '#12bc00',
          error: '#d70022'
        };
      }
    }
  },
  data() {
    return {
      show: false,
			voteid: ""
    };
  },
  watch: {
    selection: function(val) {
      this.show = val !== -1;
    }
  },
  methods: {
    submit: function() {
      const response_text = document.getElementById('submit-menu-response');

      axios.post(this.url, {
          userName: this.voteid,
          choice: this.selection
        })
        .then((response) => {
          response_text.innerText = response.data;
          response_text.style.color = this.colors.success;
        })
        .catch((err) => {
          if (err?.response?.data) {
            response_text.innerText = err.response.data;
          } else {
            response_text.innerText = 'what the fuck are you doing to my site?';
          }
					response_text.style.color = this.colors.error;
        })
			response_text.style.display = 'block';
    }
  }
};
</script>
j
<style scoped>
.slide-enter-from,
.slide-leave-to {
  transform: scaleY(0);
}

div.submit-menu-wrapper {
  transition: 1s;
  transform-origin: top;
  transition: transform 0.4s ease-in-out;
  display: grid;
  position: relative;
  top: -2em;
  z-index: -1;
  border: solid 0 2em 2em 2em #4a4a4f;
  background-color: #4a4a4f;
  border-radius: 0 0 2em 2em;
  padding: 3em 0 1em 0;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 2em;
  justify-items: center;
  align-items: center;
}

div.submit-menu-wrapper * {
  z-index: 0;
}

p#submit-menu-response {
  margin: 1em 0 0 0;
  font-family: 'Roboto Mono';
  display: none;
  grid-column: 1 / span 2;
}
</style>

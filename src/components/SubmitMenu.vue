<template>
	<transition name='slide'>
  <div class="submit-menu-wrapper" v-if="show">
    <label>
      <span class="submit-menu-name">name:</span>
      <input id="submit-menu-name-input" type="text" />
    </label>
    <button class="submit-menu-button" @click="submit">submit</button>
    <p id="submit-menu-response"></p>
  </div>
	</transition>
</template>

<script>
export default {
  name: 'SubmitMenu',
  props: {
    selection: Number,
    url: String,
		colors: {
			type: Object,
			default() { 
				return {
					success: '#12bc00',
					error: '#d70022'
				}
			}
		}
  },
	data() {
		return {
			show: false
		}
	},
  watch: {
    selection: function(val) {
			this.show = (val !== -1);
    }
  },
  methods: {
    submit: async function() {
			const response_text = document.getElementById('submit-menu-response');

      fetch(this.url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({
          userName: document.getElementById('submit-menu-name-input').value,
          choice: this.selection
        })
      })
        .then(async (response) => {
          response_text.innerText = await response.text()
          response_text.style.color = response.ok
            ? this.colors.success
            : this.colors.error;
					response_text.style.display = 'block'
        })
        .catch((err) => {
          console.error(err);
          response_text.innerText = 'what the fuck did you do to my site?';
          response_text.style.color = this.colors.error;
					response_text.style.display = 'block'
        });
    }
  }
};
</script>

<style scoped>
.slide-enter-from, .slide-leave-to {
	transform: scaleY(0);
}

div.submit-menu-wrapper {
	transition: 1s;
	transform-origin: top;
  transition: transform .4s ease-in-out;
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

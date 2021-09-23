<template>
	<div class='gallery' v-if='page === ":submit"'>
		<Auth>
			<form enctype='multipart/form-data' @submit.prevent='submit_files'>
				<label>
					dateien auswählen
					<input
						ref='fileinput'
						type='file'
						name='fileinput'
						accept='image/*,video/*'
						@input='update_selected_files'
						multiple
					/>
				</label>

				<input v-if='submitted_images.length > 0' value='bilder einsenden' type='submit'>

				<Loading ref='response_loading'>
					<p class='response'>{{ submit_response }}</p>
				</Loading>
			</form>

			<img
				v-for='image in submitted_images'
				:key='image'
				:src='image'
			/>
		</Auth>
	</div>

	<div class='gallery' v-else>
		<router-link to='/gallery:submit'>Bilder einsenden</router-link>

		<Auth @authentication='query_files'>
			<img
				v-for='image in queried_images'
				:key='image.src'
				:src='image.src'
			/>
		</Auth>
	</div>
</template>

<script>
import { ref } from 'vue'
import config from '@/config.js'
import Auth from '@/components/Auth.vue'
import Loading from '@/components/Loading.vue'

export default {
	name: 'Gallery',

	components: { Auth, Loading },

	props: {
		page: { type: String }
	},

	setup(props) {
		const fileinput = ref()
		const submitted_images = ref([])
		const queried_images = ref([])
		const submit_response = ref('')
		const response_loading = ref()
		let offset = 0

		function update_selected_files() {
			submitted_images.value = [...fileinput.value.files].map(URL.createObjectURL)
		}

		async function submit_files({ target }) {
			try {
				response_loading.value.set_loading(1)

				const data = new FormData(target)
				const response = await fetch(`${config.url}/api/gallery`, {
					method: 'POST',
					body: data
				})

				response_loading.value.set_loading(0)

				if (response.ok) {
					response_loading.value.$el.classList.remove([ 'success', 'failed' ])
					response_loading.value.$el.classList.add('success')
					submit_response.value = 'bilder versendet シ'
				}
				else
					throw 'upload failed'
			} catch {
				response_loading.value.$el.classList.remove([ 'success', 'failed' ])
				response_loading.value.$el.classList.add('failed')
				submit_response.value = 'irgentwas is schief gelaufen (╯°□°）╯︵ ┻━┻'
			}
		}

		async function query_files() {
			const request = await fetch(
				`${config.url}/api/gallery?offset=${9 * offset}&limit=9`
			)

			if (request.ok)
				offset++

			const body = await request.json()

			queried_images.value = [ ...queried_images.value, ...body ]
		}

		return {
			fileinput,
			update_selected_files,
			submit_files,
			submitted_images,
			queried_images,
			query_files,
			response_loading,
			submit_response
		}
	}
}
</script>

<style lang='scss'>
@use '../scss/colors';

.gallery {
	padding: 1rem;
	margin-top: 1rem;
	width: 100%;
	box-sizing: border-box;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 1rem;

	> a {
		grid-column: 1 / span 3;
		margin: 0 auto;
		padding: 0.25em;
		border-radius: 0.25em;
		color: white;
		background-color: colors.$primary;

		&:hover {
			background-color: colors.$secondary;
			color: colors.$light-grey;
		}
	}

	> .auth {
		grid-column: 1 / span 3;
	}

	> form {
		grid-column: 1 / span 3;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 3rem;

		> .loading {
			display: flex;
			justify-content: center;
			align-items: center;

			&.success {
				color: green;
			}

			&.failed {
				color: red;
			}
		}

		> input {
			background-color: colors.$light-grey;
			border: none;
			cursor: pointer;
			border-radius: 0.5em;
			font-size: 1rem;
			filter: drop-shadow(1px 1px 5px #000000);
			padding: 0.5rem;

			&:hover {
				background-color: colors.$grey;
				color: white;
			}
		}

		> label {
			background-color: colors.$light-grey;
			border-radius: 0.5em;
			padding: 0.5em;
			display: inline-block;
			cursor: pointer;
			font-size: 1.125rem;
			filter: drop-shadow(1px 1px 5px #000000);
		
			&:hover {
				border-color: white;
				background-color: colors.$grey;
				color: white;
			}

			> input {
				display: none;
			}
		}
	}

	> img {
		max-width: 100%;
		display: block;
	}
}
</style>

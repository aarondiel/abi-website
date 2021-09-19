<template>
	<div class='gallery'>
		<form enctype='multipart/form-data' @submit.prevent='submit_files'>
			<label>
				dateien auswählen
				<input
					ref='fileinput'
					type='file'
					accept='image/*,video/*'
					@input='update_selected_files'
					multiple
				/>
			</label>

			<input value='send shit' type='submit'>
		</form>

		<img
			v-for='image in submitted_images'
			:key='image'
			:src='image'
		/>
	</div>
</template>

<script>
import { ref } from 'vue';

export default {
	name: 'Gbr',
	setup() {
		const fileinput = ref()
		let submitted_images = ref([])

		function read_file(file) {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = () => {
				submitted_images.value = [ ...submitted_images.value, reader.result ]
			}
		}

		function update_selected_files() {
			submitted_images.value = []
			fileinput.value.files.forEach(read_file)
		}

		function submit_files() {
			// actually implement sending files here :)
			console.log(submitted_images.value)
		}

		return { fileinput, update_selected_files, submit_files, submitted_images }
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

	> form {
		grid-column: 1 / span 3;
		display: flex;
		gap: 3rem;

		> label {
			background-color: colors.$light-grey;
			border-radius: 1em;
			padding: 0.5em;
			display: inline-block;
			cursor: pointer;
			border: solid black 0.1em;
		
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

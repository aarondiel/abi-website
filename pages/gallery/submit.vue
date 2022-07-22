<script setup lang='ts'>
import { ref } from 'vue'
import { frontend_config as config } from '@/config'
import hash from 'object-hash'
import Submitbutton from '@/components/submitbutton.vue'
import Loading from '@/components/loading.vue'

const files = ref<any[]>([])
const server_response = ref('')

function update_files(ev: Event) {
	if (!(ev.target instanceof HTMLInputElement) || ev.target.files === null)
		return

	files.value = Array.from(ev.target.files)
}

async function submit(form: Event) {
	server_response.value = 'loading'

	if (!(form.target instanceof HTMLFormElement))
		return

	const data = new FormData(form.target)

	const response = await fetch(`${ config.url }/api/gallery`, {
		method: 'POST',
		credentials: 'include',
		body: data
	})

	if (response.ok)
		server_response.value = 'Danke fürs Einsenden シ'
	else {
		const error_data: string[] = await response.json()
		server_response.value = `error: ${ error_data.join(', ') }`
	}

	window.setTimeout(() => { server_response.value = '' }, 15000)
}

const url = (file: File) => URL.createObjectURL(file)
</script>
<template>
	<article class='gallery-submit'>
		<div class='images'>
			<span v-for='file in files' :key='hash(file)'>
				<img
					v-if='file.type.startsWith("image")'
					:src='url(file)'
					alt='gallery-image'
				/>
				<video v-else-if='file.type.startsWith("video")' controls>
					<source :src='url(file)' :type='file.type'/>
				</video>
			</span>
		</div>

		<form enctype='multipart/form-data' @submit.prevent='submit'>
			<label>
				Dateien auswählen

				<input
					name='files'
					type='file'
					accept='image/*,video/*'
					multiple
					@input='update_files'
				/>
			</label>

			<Submitbutton value='Einsenden'/>
		</form>

		<Loading :loading='server_response === "loading"'>
			<p
				class='server_response'
				:class='{ accepted: !server_response.startsWith("error") }'
			>
				{{ server_response }}
			</p>
		</Loading>
	</article>
</template>

<style lang='scss'>
@use '@/assets/scss/colors.scss';
@use '@/assets/scss/mixins.scss';

.gallery-submit {
	> .images {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;

		> span {
			@include mixins.gold_border;

			display: block;
			max-width: 100%;
			box-shadow: 0 0.25rem 0.5rem colors.$black;

			> img, video {
				display: block;
				max-width: calc(100% - 4px);
				border-radius: inherit;
				padding: 2px;
			}
		}
	}

	> form {
		display: flex;
		justify-content: space-evenly;
		align-items: center;

		> label {
			@include mixins.gold_border;
			padding: 1rem;
			font-size: 0.8rem;
			cursor: pointer;

			> input {
				display: none;
			}
		}
	}
}
</style>

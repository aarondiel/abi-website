<script setup lang='ts'>
import { ref } from 'vue'
import { frontend_config as config } from '@/config'
import Textmessage from '@/components/textmessage.vue'
import Submitbutton from '@/components/submitbutton.vue'
import Loading from '@/components/loading.vue'

const messages = ref<Record<string, any>[]>([])
const server_response = ref('')

function add_message(type: 'left' | 'right' | 'info') {
	if (type === 'info')
		messages.value.push({
			type: 'info',
			name: '',
			text: '',
			id: Math.random() * 10 * 16
		})
	else
		messages.value.push({
			type: 'message',
			side: type,
			name: '',
			text: '',
			id: Math.random() * 10 * 16
		})
}

async function submit() {
	server_response.value = 'loading'

	const response = await fetch(`${ config.url }/api/quotes`, {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(messages.value)
	})


	if (response.ok) {
		server_response.value = 'Danke fürs Einsenden シ'
		messages.value = []
	} else {
		const error_data: string[] = await response.json()
		server_response.value = `error: ${ error_data.join(', ') }`
	}

	window.setTimeout(() => { server_response.value = '' }, 15000)
}
</script>

<template>
	<article class='quotes-submit'>
		<p>Um ein neues Zitat einzureichen klicke auf eine der drei Textblasen unten.</p>
		<p>Linke Sprechblasen sollten für Aussagen von Lehrern benutzt werden und rechte für Aussagen von Schülern.</p>
		<p>Zentrierte Textblasen sind Informationstexte, welche die Umstände des Zitates besser schildern können.</p>
		<p>Nach dem Anklicken erscheint in der eingerahmten Box die entsprechende Textblase, diese kann nun durch anklicken editiert werdern.</p>
		<p>Bitte beachte, dass linke und rechte Nachrichtenkästen auch ein Namesfeld besitzen, wird dieses nicht ausgefüllt so ist das Zitat nicht gültig.</p>
		<p>Wenn du das Zitat fertig eingetragen hast, klicke auf "Zitat einsenden" und bete dass alles funktioniert</p>
		<p>Bei Fehlern oder anderen Unstimmigkeiten, bitte kontaktiere <b>aaron diel</b>.</p>

		<section>
			<Textmessage
				v-for='message in messages'
				:key='message.id'
				:type='message.type'
				:side='message.side'
				v-model:name='message.name'
				v-model:text='message.text'
				:editable='true'
			/>
		</section>

		<fieldset>
			<Textmessage
				type='message'
				side='left'
				text='Lehrer'
				@click='add_message("left")'
			/>
			<Textmessage
				type='info'
				text='Info'
				@click='add_message("info")'
			/>
			<Textmessage
				type='message'
				side='right'
				text='Schüler'
				@click='add_message("right")'
			/>
		</fieldset>

		<Submitbutton @click='submit' value='Zitat einsenden'/>

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
@use 'sass:color';

.quotes-submit {
	> p {
		font-size: 0.8em;
	}
	
	> section {
		background-color: color.adjust(colors.$dark-grey, $lightness: +5%);
		border-radius: 0.5em;
		border: 1px solid colors.$primary;
		box-shadow: inset 0 0.25rem 0.5rem colors.$black;
		padding: 1rem;
		margin: 1rem 0;
		box-sizing: border-box;
	}

	> fieldset {
		border-width: 3px 0;
		border-style: double;
		border-color: colors.$secondary;
		display: flex;
		padding: 0 0 1rem 0;

		margin: 0 1rem;
		
		> * {
			flex-grow: 1;
			cursor: pointer;
		}
	}

	> .submitbutton {
		margin: 1rem auto 0 auto;
	}
}
</style>

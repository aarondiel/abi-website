<template>
	<div class='gbr'>
		<FileMenu fileType='pdf' text>
			der vertrag
		</FileMenu>

		<h2>Bestrafungen/Konsequenzen für alle, die den GbR-Vertrag nicht unterschrieben haben:</h2>

		<form>
			<input id='hoodies-checkbox' type='checkbox' name='test'/>
			<label for='hoodies-checkbox'>Der Name wird nicht auf die Abi-Hoodies gedruckt</label>
		</form>

		<form>
			<input id='paper-checkbox' type='checkbox' name='test'/>
			<label for='paper-checkbox'>Die Person wird nicht in der Abi-Zeitung vermerkt</label>
		</form>

		<form>
			<input id='votings-checkbox' type='checkbox' name='test'/>
			<label for='votings-checkbox'>Ausschluss von allen folgenden Abstimmungen</label>
		</form>

		<form>
			<input id='abi-organisation-checkbox' type='checkbox' name='test'/>
			<label for='abi-organisation-checkbox'>Ausschluss vom Organisieren</label>
		</form>

		<h3>Verbot an der Beteiligung von:</h3>
		<ul class='subpoints'>
			<li>
				<form>
					<input id='abi-prom-checkbox' type='checkbox'/>
					<label for='abi-prom-checkbox'>Abi-Ball</label>
				</form>
			</li>

			<li>
				<form>
					<input id='aftershow-checkbox' type='checkbox'/>
					<label for='aftershow-checkbox'>Aftershow partys</label>
				</form>
			</li>

			<li>
				<form>
					<input id='abi-prank-checkbox' type='checkbox'/>
					<label for='abi-prank-checkbox'>Abistreich</label>
				</form>
			</li>
		</ul>

		<h3>Aufpreis für:</h3>
		<ul>
			<li>
				<h4>Hoodies</h4>
				<TextInput unit='%' ref='hoodiesInput'/>
			</li>

			<li>
				<h4>Tickets für Abiball</h4>
				<TextInput unit='%' ref='ticketsInput'/>
			</li>

			<li>
				<h4>Abizeitung</h4>
				<TextInput unit='%' ref='paperInput'/>
			</li>
		</ul>

		<section>
			<h2>Abstimmen:</h2>
			<TextInput ref='codeInput' :defaultText='id'>Zugangscode</TextInput>
			<button @click='submitVote'>Abstimmen!</button>
			<span id='vote-response'></span>
		</section>
	</div>
</template>

<script>
import FileMenu from '../components/FileMenu.vue';
import TextInput from '../components/TextInput.vue';

export default {
	name: 'Gbr',
	components: {
		FileMenu,
		TextInput
	},
	setup() {
		// get the id parameter from the url
		const uri = window.location.search.substring(1);
		const params = new URLSearchParams(uri);
		const id = params.get("id");

		return {
			id
		}
	},
	methods: {
		async submitVote() {
			const exclusion = {
				prom: document.getElementById('abi-prom-checkbox').checked,
				aftershow: document.getElementById('aftershow-checkbox').checked,
				prank: document.getElementById('abi-prank-checkbox').checked
			};

			const fees = {
				hoodies: this.$refs.hoodiesInput.text + '%',
				tickets: this.$refs.ticketsInput.text + '%',
				paper: this.$refs.paperInput.text + '%'
			};

			const submission = {
				hoodiesName: document.getElementById('hoodies-checkbox').checked,
				paperName: document.getElementById('paper-checkbox').checked,
				votings: document.getElementById('votings-checkbox').checked,
				organisation: document.getElementById('abi-organisation-checkbox').checked,
				exclusion,
				fees
			};

			const code = this.$refs.codeInput.text;

			const response = await fetch('http://aarondiel.com:8080/abi/api/gbr', {
				method: 'POST',
				mode: 'cors',
				cache: 'no-cache',
				credentials: 'omit',
				headers: { 'Content-Type': 'application/json' },
				redirect: 'follow',
				referrerPolicy: 'no-referrer',
				body: JSON.stringify({ code, submission })
			})

			const message = await response.json();
			const voteResponse = document.getElementById('vote-response');

			if (response.ok) {
				voteResponse.className = 'ok';
				voteResponse.innerText = 'successfully voted';
			} else {
				voteResponse.className = 'failed';
				voteResponse.innerText = message.message;
			}
		}
	},
}
</script>

<style lang="scss" scoped>
@use '../scss/fonts';
@use '../scss/colors';

.gbr {
	width: 100%;
	margin-top: 1rem;

	h2 {
		margin-top: 1rem;
		margin-bottom: 0;
		font-family: fonts.$cursive;
		font-size: 2.25rem;
		color: colors.$primary;
	}

	h3 {
		margin: 1rem 0 0 0;
	}

	h4 {
		margin: 0;
	}

	form {
		display: flex;
		align-items: center;
		margin: 0.5rem 0;

		&.wrap {
			flex-wrap: wrap;
		}
	}

	ul {
		margin: 0;
		padding: 0 1.5rem;
		list-style: none;
	}

	input[type='checkbox'] {
		margin-right: 0.5rem;
	}

	input[type='text'] {
		width: 100%;
		margin-bottom: 0.5rem;
	}

	section {
		margin-top: 1rem;
		box-sizing: border-box;
		width: 100%;
		color: #ffffff;
		background-color: colors.$primary;
		padding: 1rem;

		h2 {
			color: #ffffff;
			margin: 0;
		}

		#vote-response {
			margin-left: 1rem;

			&.failed {
				color: colors.$red;
			}

			&.ok {
				color: colors.$green;
			}
		}
	}

	> *:not(section) {
		margin-left: 1rem;
		margin-right: 1rem
	}
}
</style>

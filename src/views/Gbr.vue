<template>
	<div class="gbr">
		<FileMenu fileType="pdf" text>
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
			<label for='votings-checkbox'>Auschluß von allen folgenden Abstimmungen</label>
		</form>

		<form>
			<input id='abi-organisation-checkbox' type='checkbox' name='test'/>
			<label for='abi-organisation-checkbox'>Beteiligung an der Organisation</label>
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
				<form class='wrap'>
					<label for='extra-hoodies'>Hoodies</label>
					<input id='extra-hoodies' type='text'/>
				</form>
			</li>

			<li>
				<form class='wrap'>
					<label for='extra-tickets'>Tickets für Abiball etc.</label>
					<input id='extra-tickets' type='text'/>
				</form>
			</li>
		</ul>

		<section>
			<h2>Abstimmen:</h2>
			<form class='wrap'>
				<label for='code-input'>Zugangscode:</label>
				<input id='code-input' type='text' :value='id'/>
			</form>
			<button @click='submitVote'>Abstimmen!</button>
		</section>
	</div>
</template>

<script>
import FileMenu from '../components/FileMenu.vue';
import { ref } from 'vue';

export default {
	name: 'Gbr',
	components: {
		FileMenu
	},
	setup() {
		// get the id parameter from the url
		const uri = window.location.search.substring(1);
		const params = new URLSearchParams(uri);
		const id = ref(params.get("id"));

		return {
			id
		}
	},
	methods: {
		submitVote() {
			const exclusion = {
				prom: document.getElementById('abi-prom-checkbox').checked,
				aftershow: document.getElementById('aftershow-checkbox').checked,
				prank: document.getElementById('abi-prank-checkbox').checked
			}

			const fees = {
				hoodies: document.getElementById('extra-hoodies').value,
				tickets: document.getElementById('extra-tickets').value
			}

			const data = {
				hoodiesName: document.getElementById('hoodies-checkbox').checked,
				paperName: document.getElementById('paper-checkbox').checked,
				votings: document.getElementById('votings-checkbox').checked,
				organisation: document.getElementById('abi-organisation-checkbox').checked,
				code: document.getElementById('code-input').value,
				exclusion,
				fees,
			}

			fetch('http://localhost:8080/api/abi/gbr/', {
				method: 'POST',
				mode: 'cors',
				cache: 'no-cache',
				credentials: 'omit',
				headers: { 'Content-Type': 'application/json' },
				redirect: 'follow',
				referrerPolicy: 'no-referrer',
				body: JSON.stringify(data)
			}).then(response => {
				console.log(response);
			});
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
		font-size: 2rem;
		color: colors.$primary;
	}

	h3 {
		margin: 1rem 0 0 0;
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
		box-sizing: border-box;
		width: 100%;
		color: #ffffff;
		background-color: colors.$primary;
		padding: 1rem;

		h2 {
			color: #ffffff;
			margin: 0;
		}
	}

	> *:not(section) {
		margin-left: 1rem;
		margin-right: 1rem
	}
}
</style>

<template>
	<div class='gbr'>
		<a href='files/gbr vertrag.pdf' download>
			<FileMenu fileType='pdf'>
				<p>Der Vertrag</p>
			</FileMenu>
		</a>

		<h2>Bestrafungen/Konsequenzen für alle, die den GbR-Vertrag nicht unterschrieben haben:</h2>

		<section class='form'>
			<Collapsible :toggled='isBig'>
				<p>Kreuze alle Bestrafungen an, die du für gerecht hälst.</p>
				<p>Du kannst auch keine der Optionen ankreuzen, falls du denkst, dass diese nicht notwendig sind.</p>
				<p>Wenn über 50% für einen der Nachteile gestimmt haben, wird dieser in Kraft treten.</p>
				<p>Neben diesen ankreuzbaren Nachteilen gibt es auch noch die Aufpreise.</p>
				<p>Bitte gib hier jeweils eine Zahl von 0 bis 100 ein (es wird auf Zehnerstellen gerundet).</p>
				<p>Diese Zahl ist die prozentuale Preiserhöhung für das jeweilige Produkt.</p>
				<p>Der Preis für die Nicht-GbR-Mitglieder ist dann der Normalpreis + der gewählte Aufpreis.</p>
				<p>0% entspräche somit dem Originalpreis und 100% dem doppelten Preis.</p>
				<p>Falls mindestens 50% aller Stimmen keinen Aufpreis angeben, wird dieser auch nicht eingeführt, sonst wird der Durchschnitt aller Angaben gebildet.</p>
				<p>Zum Abstimmen dann einfach den Zugangscode, den du per E-Mail zugesendet bekommen hast, eintippen und auf "Abstimmen!" klicken.</p>
			</Collapsible>

			<div>
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
			</div>
		</section>

		<section class='submit'>
			<h2>Abstimmen:</h2>
			<Auth>
				<button @click='submitVote'>Abstimmen!</button>
				<span id='vote-response'></span>
			</Auth>
		</section>
	</div>
</template>

<script>
import FileMenu from '../components/FileMenu.vue';
import TextInput from '../components/TextInput.vue';
import Collapsible from '../components/Collapsible.vue';
import Auth from '../components/Auth.vue'

export default {
	name: 'Gbr',

	components: {
		FileMenu,
		TextInput,
		Collapsible,
		Auth
	},

	setup() {
		// get the id parameter from the url
		const uri = window.location.search.substring(1);
		const params = new URLSearchParams(uri);
		const id = params.get("id");

		const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
		const isBig = document.body.clientWidth > 62 * rem;

		return { id, isBig }
	},

	methods: {
		async submitVote() {
			const exclusions = {
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
				exclusions,
				fees
			};


			const response = await fetch('http://abi.aarondiel.com/api/gbr', {
				method: 'POST',
				mode: 'cors',
				cache: 'no-cache',
				credentials: 'same-origin',
				headers: { 'Content-Type': 'application/json' },
				redirect: 'follow',
				referrerPolicy: 'no-referrer',
				body: JSON.stringify({submission })
			})

			const voteResponse = document.getElementById('vote-response');

			if (response.ok) {
				voteResponse.className = 'ok';
				voteResponse.innerText = 'successfully voted';
			} else {
				voteResponse.className = 'failed';

				const message = await response.json();
				voteResponse.innerText = message.message;
			}
		}
	},
}
</script>

<style lang="scss">
@use '../scss/fonts';
@use '../scss/colors';
@use '../scss/media';

.gbr {
	width: 100%;
	margin-top: 1rem;

	> * + * {
		margin-top: 1rem;
	}

	> *:not(section.submit) {
		margin-left: 1rem;
		margin-right: 1rem
	}

	> a {
		display: block;
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

	section.form {
		display: flex;
		justify-content: space-between;
		flex-direction: column;

		@include media.tablet() {
			flex-direction: row-reverse;
		}

		/*explanation text*/
		> .collapsible {
			width: 90%;
			margin: 0 auto 1rem auto;

			p {
				font-size: 0.8rem;
			}

			p + p {
				margin-top: 1rem;
			}

			@include media.tablet() {
				margin: 0 0 0 1rem;
				width: 50%;
			}
		}
	}

	section.submit {
		box-sizing: border-box;
		width: 100%;
		color: #ffffff;
		background-color: colors.$primary;
		padding: 1rem;

		h2 {
			color: #ffffff;
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
}
</style>

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
			<input id='abi-prank-checkbox' type='checkbox' name='test'/>
			<label for='abi-prank-checkbox'>Beteiligung an der Organisation</label>
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
	</div>
</template>

<script>
import FileMenu from '../components/FileMenu.vue'

export default {
	name: 'Gbr',
	components: {
		FileMenu
	}
}
</script>

<style lang="scss" scoped>
@use '../scss/fonts';
@use '../scss/colors';

.gbr {
	margin: 1rem 1rem 0 1rem;

	h2 {
		margin: 0.25rem 0 0 0;
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
}
</style>

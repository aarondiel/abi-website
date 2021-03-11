const nodemailer = require('nodemailer');
const config = require('./config');
const fs = require('fs');

const transport = nodemailer.createTransport({
	host: config.mail.host,
	port: 587,
	auth: {
		user: config.mail.username,
		pass: config.mail.password
	}
});

function parseHtml(template, props) {
	// find and replace all literals ${ text } with props[text]
	template = template.replace(
		/\$\{\s*([^\{\}\s]+)\s*\}/g,
		(match, capture) => props[capture]
	);

	// remove all tabbing at the beginning of each line
	template = template.replace(/^\s+/gm, '');

	// remove all newlines
	template = template.replace(/\n/g, '');

	return template;
}

async function main() {
	const template = fs.readFileSync('./mail.html', 'utf-8');

	const props = {
		title: 'fuck you',
		code: 'testcode'
	};

	const message = {
		from: `abi organisations bot <${config.mail.username}>`,
		to: 'aaron.diel@t-online.de',
		subject: 'abitur 2022 organisation',
		html: parseHtml(template, props)
	};

	const info = await transport.sendMail(message);

	console.log(info);
}

main().then(() => {
	process.exit(0);
}).catch(err => {
	console.err(err);
	process.exit(1);
});

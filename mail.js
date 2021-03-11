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

const message = {
	from: config.mail.username,
	to: 'aaron.diel@t-online.de',
	subject: 'abitur 2022 organisation',
	html: '<h1>test</h1>'
};

const props = {
	title: 'fuck you'
};

function parseHtml() {
	let template = fs.readFileSync('./mail.html', 'utf-8');
	
	// find and replace all literals ${ text } with props[text]
	template = template.replace(
		/\$\{\s*([^\{\}\s]+)\s*\}/g,
		(match, capture) => props[capture]
	);

	return template;
}

async function main() {
	const info = await transport.sendMail(message);

	console.log(info);
}

parseHtml();

//main().then(() => {
	//process.exit(0);
//}).catch(err => {
	//console.err(err);
	//process.exit(1);
//});

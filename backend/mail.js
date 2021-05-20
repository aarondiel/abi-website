import nodemailer from 'nodemailer';
import fs from 'fs';
import mongodb from './models/mongodb.js';
import users from './models/user.js';
import config from './config.js';

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
	const template = fs.readFileSync('./mails/quotes.html', 'utf-8');

	await mongodb();

	// // organisation team
	// const students = await users.find({
	// 	name: /aaron.*diel|mirjam|christine|daniel|elias|henrik|lucas kober|olga|philipp straßburger|phillip kleh|roman|tillmann/i
	// });

	// all students
	const students = await users.find({ });
	
	// // just me
	// const students = await users.find({ name: /aaron.*diel/i });
	
	for (const student of students) {
		if (!student?.email)
			continue;

		const props = {
			code: student.code
		};

		const message = {
			from: `abi organisations bot <${config.mail.username}>`,
			to: student.email,
			subject: 'abitur 2022 organisation',
			html: parseHtml(template, props)
		};

		const info = await transport.sendMail(message);

		if (info.accepted)
			console.log(`successfully sent mail to ${student.name}`);
		else
			console.log(`failed to send mail to ${student.name}`);
	}
}

main().then(() => {
	process.exit(0);
}).catch(err => {
	console.error(err);
	process.exit(1);
});

import nodemailer from 'nodemailer'
import users from './models/users'
import config from './config'
import mongoose from 'mongoose'
import { readFileSync } from 'fs'

const transport = nodemailer.createTransport({
	host: config.mail.host,
	port: 587,
	auth: {
		user: config.mail.username,
		pass: config.mail.password
	}
})

interface Props {
	[ key: string ]: string
}

function parseHtml(template: string, props: Props) {
	// find and replace all literals ${ text } with props[text]
	template = template.replace(
		/\$\{\s*([^\{\}\s]+)\s*\}/g,
		(_match, capture) => props[capture]
	)

	// remove all tabbing at the beginning of each line
	template = template.replace(/^\s+/gm, '')

	// remove all newlines
	template = template.replace(/\n/g, '')

	return template
}

const mongodb_connect = new Promise<void>((res, rej) => {
	mongoose.connection.once('error', rej)
	mongoose.connection.once('open', res)

	mongoose.connect(
		`${config.mongodb.url}:${config.mongodb.port}/abi`,
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
})

async function main() {
	const template = readFileSync('src/mails/gallery.html', 'utf-8')

	await mongodb_connect

	// // organisation team
	// const students = await users.find({
	// 	name: /aaron.*diel|mirjam|christine|daniel|elias|henrik|lucas kober|olga|philipp straßburger|phillip kleh|roman|tillmann/i
	// });

	// // all students
	// const students = await users.find({ })
	
	// // just me
	const students = await users.find({ name: /aaron.*diel/i });
	
	for (const student of students) {
		if (!student?.email)
			continue

		const props = {
			code: student.code
		}

		const message = {
			from: `abi organisations bot <${config.mail.username}>`,
			to: student.email,
			subject: 'abitur 2022 organisation',
			html: parseHtml(template, props)
		}

		const info = await transport.sendMail(message)

		if (info.accepted)
			console.log(`successfully sent mail to ${student.name}`)
		else
			console.log(`failed to send mail to ${student.name}`)
	}
}

main().then(() => {
	process.exit(0)
}).catch(err => {
	console.error(err)
	process.exit(1)
})

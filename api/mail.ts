import { Router } from 'express'
import { assert_privilege } from '@/lib/middleware'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import nodemailer from 'nodemailer'
import config from '@/config'
import users from '@/models/users'

const transport = nodemailer.createTransport({
	pool: true,
	host: config.mail.host,
	port: 587,
	secure: false,
	auth: {
		user: config.mail.username,
		pass: config.mail.password
	}
})

function parseHtml(template: string, props: Record<string, string>) {
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

async function get_students(which: 'me' | 'team' | 'all') {
	let user_array: string[] = []

	switch (which) {
		case 'me':
			user_array = [ '603d3687287981fd9eafe158' ]
			break

		case 'team':
			user_array = [
				'603d3687287981fd9eafe158',
				'61939b8bdee3ac26e941dfee',
				'603d3687287981fd9eafe15d',
				'603d3687287981fd9eafe184',
				'603d3687287981fd9eafe186',
				'603d3687287981fd9eafe19e',
				'603d3687287981fd9eafe175'
			]
			break

		case 'all':
			return await users.find({}, [ '-_id', 'email', 'code', 'name' ])

		default:
			return []
	}

	return await users.find({ _id: { $in: user_array } }, [ '-_id', 'email', 'code', 'name' ])
}

const route = Router()

route.post('/', assert_privilege('admin'), async (req, res, _next) => {
	const template = readFileSync(
		resolve(process.cwd(), `mails/${ req.body.file }.html`),
		'utf-8'
	)
	
	let students = await get_students(req.body.send_to)

	await Promise.all(students.map(async (student: any) => {
		if (!student.email)
			return

		const props = {
			name: student.name,
			code: student.code
		}

		const info = await transport.sendMail({
			from: `"abi organisations bot" <${config.mail.username}>`,
			to: student.email,
			subject: 'abitur 2022 organisation',
			html: parseHtml(template, props)
		})


		if (info.accepted)
			res.write(`successfully sent mail to ${student.name}\n`)
		else
			res.write(`failed to send mail to ${student.name}\n`)
	}))

	res.end()
})

export default route

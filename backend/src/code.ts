import mongoose from 'mongoose'
import users from './models/users'
import config from './config'
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-='

const mongodb_connect = new Promise<void>((res, rej) => {
	mongoose.connection.once('error', rej)
	mongoose.connection.once('open', res)

	mongoose.connect(
		`${config.mongodb.url}:${config.mongodb.port}/abi`,
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
})

function generateCode() {
	let code = ''
	for (let i = 0; i < 10; i++) {
		const randint = Math.floor(chars.length * Math.random())
		code += chars[randint]
	}

	return code
}

async function main() {
	await mongodb_connect
	const code = generateCode()

	try {
		await users.create({
			code: code,
			name: 'patrik berger',
			email: 'patrik.berger01@web.de',
			gbr: false
		})
	} catch (err) {
		console.log(err)
		return
	}
}

main().then(() => {
	process.exit(0)
})

import { connection, connect, set } from 'mongoose'
import config from '@/config'

export async function setup() {
	await new Promise<void>((res, rej) => {
		connection.once('error', rej)
		connection.once('open', res)

		connect(`${ config.mongodb.url }:${ config.mongodb.port }/abi`)
	})

	set('runValidators', true)

	console.log('\x1b[32m' + '✔' + '\x1b[0m' + ' Connected to MongoDB')
}

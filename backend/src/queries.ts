import { Pool } from 'pg'
import config from './config'

const pool = new Pool({
	user: config.postgresql.user,
	password: config.postgresql.password,
	host: config.postgresql.host,
	database: config.postgresql.database,
	port: config.postgresql.port
})

async function get_all_users() {
	const users = await pool.query('SELECT * FROM users ORDER BY firstname ASC').rows
	return users
}

async function add_new_user(code) {
	const firstname = 'aaron'
	const lastname = 'diel'
	const email = 'aaron.diel@t-online.de'

	const response = await pool.query(
		'INSERT INTO users (code, firstname, lastname, email) VALUES ($1, $2, $3, $4)',
		[ code, firstname, lastname, email ]
	)

	return response
}

async function update_gbrsigned(code: string) {
	const response = await pool.query(
		'UPDATE users SET gbrsigned = true WHERE code = $1',
		[ code ]
	)

	return response
}

update_gbrsigned('testtesttest').then(console.log)

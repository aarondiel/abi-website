import pg from 'pg'
import config from './config'

interface User {
	[key: string]: any,
	code: string,
	firstname: string,
	middlename?: string,
	lastname: string,
	email?: string,
	gbrsigned: boolean
}

type Optional<Type> = {
	[Property in keyof Type]?: Type[Property]
}

const pool = new pg.Pool({
	user: config.postgresql.user,
	password: config.postgresql.password,
	host: config.postgresql.host,
	database: config.postgresql.database,
	port: config.postgresql.port
})

async function make_user_table() {
	const response = pool.query(`
		CREATE TABLE users(
			code varchar(10) PRIMARY KEY NOT NULL,
			firstname varchar(20) NOT NULL,
			middlename varchar(20),
			lastname varchar(20) NOT NULL,
			gbrsigned BOOLEAN DEFAULT false,
			email varchar(50)
		)
	`)

	return response
}

export async function get_all_users() {
	const users = await pool.query('SELECT * FROM users')
	return users.rows
}

export async function add_new_user(user: User) {
	const response = await pool.query(
		'INSERT INTO users (code, firstname, middlename, lastname, email, gbrsigned) VALUES ($1, $2, $3, $4, $5, $6)',
		[ user.code, user.firstname, user.middlename, user.lastname, user.email, user.gbrsigned ]
	)

	return response
}

export async function update_user(code: string, options: Optional<User>) {
	const keys = Object.keys(options)
	if (keys.length === 0)
		return

	const changes = keys.map((key: keyof User) => {
		if (typeof options[key] === 'boolean')
			return `${key} = ${options[key] ? 'true' : 'false'}`

		return `${key} = ${options[key]}`
	})

	const response = pool.query(
		`UPDATE users SET ${changes.join(' ')} WHERE code = $1`,
		[ code ]
	)

	return response
}

export async function delete_user(code: string) {
	const response = pool.query(
		'DELETE FROM users WHERE code = $1',
		[ code ]
	)

	return response
}

if (require.main === module) {
	update_user('fAR4SCGaMB', { gbrsigned: true }).then(console.log)
}

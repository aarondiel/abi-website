const mongodb = require('./models/mongodb');
const users = require('./models/user');
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-=';

function generateCode() {
	let code = '';
	for (let i = 0; i < 10; i++) {
		const randint = Math.floor(chars.length * Math.random());
		code += chars[randint];
	}

	return code;
}

async function main() {
	await mongodb.connect();

	const students = await users.find();

	for (student of students) {
		const code = generateCode();

		try {
			await users.updateOne({ _id: student.id }, {
				$set: {
					code: code
				}
			});

			console.log(`successfully updated: ${student.name}\n${code}\n`);
		} catch (err) {
			console.log(err);
			return;
		}
	}
}

main().then(() => {
	process.exit(0);
})

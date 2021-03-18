const mongodb = require('./models/mongodb');
const users = require('./models/user');
const gbrVote = require('./models/gbr-vote')
const util = require('util');

async function getGbrVotes() {
	await mongodb.connect();

	const query = await gbrVote.aggregate([
		{
			$lookup: {
				from: 'users',
				localField: 'user',
				foreignField: '_id',
				as: 'user'
			}
		},
		{ $unwind: '$user' },
		{
			$project: {
				_id: 0,
				name: '$user.name',
				submission: '$submission'
			}
		}
	]);

	console.log(util.inspect(query, false, null, true));
}

getGbrVotes().then(() => {
	process.exit(0);
}).catch(err => {
	console.error(err);
	process.exit(1);
})

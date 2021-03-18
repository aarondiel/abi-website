const mongodb = require('./models/mongodb');
const users = require('./models/user');
const gbrVote = require('./models/gbr-vote')

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

	console.log(JSON.stringify(query, null, 2));
}

getGbrVotes().then(() => {
	process.exit(0);
}).catch(err => {
	console.error(err);
	process.exit(1);
})

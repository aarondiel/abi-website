const mongodb = require('./models/mongodb');
const gbrVote = require('./models/gbr-vote')
const util = require('util');

async function getGbrVotes() {
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

	return query;
}

async function getGbrPercent() {
	const query = await gbrVote.aggregate([
		{
			$group: {
				_id: false,
				votes: { $sum: 1 },

				hoodies: { $sum: { $toInt: '$submission.hoodiesName' } },
				paper: { $sum: { $toInt: '$submission.paperName' } },
				votings: { $sum: { $toInt: '$submission.votings' } },
				organisation: { $sum: { $toInt: '$submission.organisation' } },

				promExclusion: { $sum: { $toInt: '$submission.exclusions.prom' } },
				aftershowExclusion: { $sum: { $toInt: '$submission.exclusions.aftershow' } },
				prankExclusion: { $sum: { $toInt: '$submission.exclusions.prank' } },

				hoodiesFee: { $sum: '$submission.fees.hoodies' },
				hoodiesEmpty: { $sum: { $toInt: { $ne: [ '$submission.fees.hoodies', 0 ] } } },
				ticketsFee: { $sum: '$submission.fees.tickets' },

				ticketsEmpty: { $sum: { $toInt: { $ne: [ '$submission.fees.tickets', 0 ] } } },
				paperFee: { $sum: '$submission.fees.paper' },
				paperEmpty: { $sum: { $toInt: { $ne: [ '$submission.fees.paper', 0 ] } } },
			}
		},
		{
			$project: {
				_id: false,
				votes: '$votes',

				hoodies: { $concat: [ { $toString: { $round: { $multiply: [ { $divide: [ '$hoodies', '$votes' ] }, 100 ] } } }, '%' ] }, 
				paper: { $concat: [ { $toString: { $round: { $multiply: [ { $divide: [ '$paper', '$votes' ] }, 100 ] } } }, '%' ] }, 
				votings: { $concat: [ { $toString: { $round: { $multiply: [ { $divide: [ '$votings', '$votes' ] }, 100 ] } } }, '%' ] }, 
				organisation: { $concat: [ { $toString: { $round: { $multiply: [ { $divide: [ '$organisation', '$votes' ] }, 100 ] } } }, '%' ] }, 

				exclusions: {
					prom: { $concat: [ { $toString: { $round: { $multiply: [ { $divide: [ '$promExclusion', '$votes' ] }, 100 ] } } }, '%' ] }, 
					aftershow: { $concat: [ { $toString: { $round: { $multiply: [ { $divide: [ '$aftershowExclusion', '$votes' ] }, 100 ] } } }, '%' ] }, 
					prank: { $concat: [ { $toString: { $round: { $multiply: [ { $divide: [ '$prankExclusion', '$votes' ] }, 100 ] } } }, '%' ] }, 
				},

				fees: {
					hoodies: {
						average: { $concat: [ { $toString: { $round: { $divide: [ { $sum: '$hoodiesFee' }, '$votes' ] } } }, '%' ] },
						votes: { $concat: [ { $toString: { $round: { $multiply: [ { $divide: [ '$hoodiesEmpty', '$votes' ] }, 100 ] } } }, '%' ] }
					},

					tickets: {
						average: { $concat: [ { $toString: { $round: { $divide: [ { $sum: '$ticketsFee' }, '$votes' ] } } }, '%' ] },
						votes: { $concat: [ { $toString: { $round: { $multiply: [ { $divide: [ '$ticketsEmpty', '$votes' ] }, 100 ] } } }, '%' ] }
					},

					paper: {
						average: { $concat: [ { $toString: { $round: { $divide: [ { $sum: '$paperFee' }, '$votes' ] } } }, '%' ] },
						votes: { $concat: [ { $toString: { $round: { $multiply: [ { $divide: [ '$paperEmpty', '$votes' ] }, 100 ] } } }, '%' ] }
					},
				}
			}
		}
	])

	return query;
}

async function getGbrFucked() {
	const query = await gbrVote.aggregate([
		{ $match: { 'submission.exclusions': { $exists: false } } },
		{ $lookup: {
				from: 'users',
				localField: 'user',
				foreignField: '_id',
				as: 'user'
			}
		},
		{ $unwind: '$user' },
		{ $project: {
			_id: false,
			name: '$user.name'
		} }
	]);

	return query;
}

async function main() {
	await mongodb.connect();

	let query = new Object();

	switch (process.argv[2]) {
		case 'getGbrVotes':
			query = await getGbrVotes();
			break;

		case 'getGbrPercent':
			query = await getGbrPercent();
			break;

		case 'getGbrFucked':
			query = await getGbrFucked();
			break;
	}

	console.log(util.inspect(query, false, null, true));
}

main().then(() => {
	process.exit(0);
}).catch(err => {
	console.error(err);
	process.exit(1);
})

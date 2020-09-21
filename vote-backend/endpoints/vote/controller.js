const Vote = require('../../models/vote')
const config = require('../../config')

exports.postVote = (req, res, next) => {
  // set backend controlled properties
  req.body.creationDate = Date.now();
  req.body.userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // create the vote
  return Vote.create(req.body).then(vote => {
    res.status(200).json({message: "Voted."})
  }).catch(err => {
    next({ status: 500, message: err.message })
  });
}

exports.listVotes = (req, res, next) => {
  Vote.find({}).then(votes => {
    // only send choices
    res.status(200).json(votes.map(vote => vote.choice))
  }).catch(err => {
    next({ status: 500, message: err.message })
  })
}
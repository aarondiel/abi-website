const Vote = require('../../models/vote')
const config = require('../../config')

exports.postVote = (req, res, next) => {
  // set backend controlled properties
  req.body.lastChanged = Date.now();

  // create the vote
  Vote.findOne({
    userAccessCode: req.body.userAccessCode,
  }).then(data => {
    if (!data) {
      return Vote.create(req.body).then(vote => {
        res.status(200).json({message: "Voted."})
      }).catch(err => {
        next({ status: 500, message: err.message })
      });
    } else {
      data.choice = req.body.choice
      data.save(function(err) {
        if (err) {
          next({ status: 500, message: err.message })
        } else {
          res.status(200).json({message: "Vote updated."})
        }
      })
    }
  })
}

exports.listVotes = (req, res, next) => {
  Vote.find({}).then(votes => {
    // only send choices
    res.status(200).json(votes.map(vote => vote.choice))
  }).catch(err => {
    next({ status: 500, message: err.message })
  })
}
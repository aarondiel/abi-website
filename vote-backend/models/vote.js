const mongoose = require('mongoose')

const VoteSchema = new mongoose.Schema({
  // user input
  userName: {
    type: String,
    required: [true, "Please provide a name."],
    // check if name is valid
    match: [/^([a-zA-Z\säöüß]){6,50}$/, 'Please provide a valid name (only use letters, max length of 50, min length of 6).'],
    // check if name is in use
    validate: {
      validator: function() {
        return new Promise((res, rej) => Vote.findOne({userName: this.userName, _id: {$ne: this._id}}).then(data => res(!data)).catch(err => res(false)))
      },
      message: 'Already voted.',
    }
  },

  choice: {
    type: Number,
    required: [true, "Please choose."],
  },

  // backend input
  userIp: {
    type: String,
    required: false,
    // check if ip is in use
    validate: {
      validator: function() {
        return new Promise((res, rej) => Vote.findOne({userIp: this.userIp, _id: {$ne: this._id}}).then(data => res(!data)).catch(err => res(false)))
      },
      message: 'Already voted.',
    }
  },
  creationDate: {
    type: Date,
    required: false,
  },
})

const Vote = mongoose.model('Vote', VoteSchema)

module.exports = exports = Vote

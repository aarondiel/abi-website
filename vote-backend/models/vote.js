const mongoose = require('mongoose')
const uacValidator = require('../helpers/uac-validator')

const VoteSchema = new mongoose.Schema({
  // user input
  userAccessCode: {
    type: String,
    required: [true, "Bitte gib deinen Zugriffscode an."],
    // check if uac is valid
    validate: {
      validator: function() {
        return new Promise((res, rej) => {
          res(uacValidator.check(this.userAccessCode))
        })
      },
      message: 'Bitte gib einen gültigen Zugriffscode an.',
    }
  },

  choice: {
    type: Number,
    required: [true, "Bitte wähle eine Option."],
  },

  // backend input
  lastChanged: {
    type: Date,
    required: false,
  },
})

const Vote = mongoose.model('Vote', VoteSchema)

module.exports = exports = Vote

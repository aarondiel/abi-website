let codedb = require('./uac-validator-codes.json');

exports.check = code => {
  console.log("check!")
  return new Promise(function (res) {
    try {
      for(var i = 0; i < codedb.codes.length; i++) {
        if (code === codedb.codes[i].code) {
          return res(true);
        }
      }
      res(false);
    } catch (err) {
      res(err);
    }
  });
}
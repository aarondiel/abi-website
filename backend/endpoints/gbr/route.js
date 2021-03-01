const express = require('express');
const router = express.Router();

console.log(process.cwd());

router.get('/', ({res}) => {
	res.send('<p>test</p>');
})

router.post('/', () => {

})

module.exports = router

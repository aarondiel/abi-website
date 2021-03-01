const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config')
const gbr = require('./endpoints/gbr/route')
const mongodb = require('./models/mongodb');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// endpoints

// handle next(error) calls
app.use(({ info, res }) => {
	const { status, message } = info;
	console.error(JSON.stringify(info, null, 2));
	res.status(status).send(message);
});

app.get('/abi/', ({ res }) => {
	res.send('<p>Hello World</p>');
})

app.use('/api/abi/gbr', gbr);

mongodb.connect().then(() => {
	app.listen(config.port, () => {
		console.log(`listening on http://localhost:${config.port}`);
	})
});


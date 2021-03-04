const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const abi = require('./endpoints/route');
const mongodb = require('./models/mongodb');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// endpoints
app.use('/abi', abi);

mongodb.connect().then(() => {
	app.listen(config.port, () => {
		console.log(`listening on http://localhost:${config.port}`);
	});
});


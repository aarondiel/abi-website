import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import config from './config.js';
import abi from './endpoints/route.js';
import mongodb from './models/mongodb.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

app.use('/', abi);

mongodb().then(() => {
	app.listen(config.port, () => {
		console.log(`listening on http://localhost:${config.port}`);
	});
});


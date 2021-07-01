import { Router } from 'express'
const router = Router();
import slogan from './slogan/route.js';
import gbr from './gbr/route.js';
import quotes from './quotes/route.js';
import auth from './auth/route.js';

router.use('/auth', auth);
router.use('/slogan', slogan);
router.use('/gbr', gbr);
router.use('/quotes', quotes);

// error handling
router.use('/', (err, req, res, next) => {
	switch (typeof err) {
		case 'string':
			res.status(400).json({ message: err });
			break;

		case 'object':
			if (err.errors === undefined)
				res.status(500).json({ message: 'some error accrued' });
			
			// collect every validation error
			const errors = Object.values(err.errors).map(v => v.message);
			res.status(400).json({ message: errors[0] });
			break;

		default:
			res.status(500).json({ message: 'some error accrued' });
			break;
	}
})

export default router;

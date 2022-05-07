const Express = require('express');
const Passport = require('passport');
const JWT = require('jsonwebtoken');			
const db = require('../../models/index');
require('dotenv').config()
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const router = Express.Router();

const jwtStrategyOptions = {
	secretOrKey: process.env.JWT_SECRET,
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

Passport.use(new JwtStrategy(jwtStrategyOptions, async (jwtPayload, done) => {
	const user = await db.User.findByPk(jwtPayload?.id);

	if (user) {
		return done(null, user);
	}
	else {
		return done(new Error('Authentication Failed'), false);
	}
}))

router.post('/signup', async (req, res) => {
	if (!req?.body?.username || !req?.body?.password) {
		return res.status(422).json({
			message: 'Invalid input'
		});
	}

	const newUser = await db.User.create({
		username: req.body.username,
		password: await db.User.hashPassword(req.body.password),
	});
	await newUser.reload();

	return res.json(newUser);
});


router.post('/login', async (req, res) => {
	if (!req?.body?.username || !req?.body?.password) {
		return res.status(422).json({
			message: 'Invalid input'
		});
	}
	
	const user = await db.User.findOne({ where:{ username: req.body.username } });

	if (! (await user.isValidPassword(req.body.password))) {
		return res.status(400).json({
			message: 'Invalid password'
		});
	}

	const token = JWT.sign(user.toJSON(), process.env.JWT_SECRET);
	user.setDataValue('token', token);
	return res.json(user);
});

router.get('/me', Passport.authenticate('jwt', { session: false }), async (req, res) => {
	return res.json(req?.user);
});

module.exports = router;

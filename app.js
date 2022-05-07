const Express = require('express');
const authRouter = require('./app/routes/auth');
const Passport = require('passport');

const app = Express();

app.use(Express.json());
app.use('/auth', authRouter);
app.use(Passport.initialize());


app.listen(3000);
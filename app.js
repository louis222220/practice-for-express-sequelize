const Express = require('express');
const routers = require('./app/routes/index');
const Passport = require('passport');

const app = Express();

app.use(Express.json());
app.use(routers);
app.use(Passport.initialize());

app.listen(3000);
const Express = require('express');
const authRouter = require('./auth');

const routers = Express.Router();
routers.use('/auth', authRouter);

module.exports = routers;
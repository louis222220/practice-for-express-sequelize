const Express = require('express');
const authRouter = require('./auth');
const productRouter = require('./product');

const routers = Express.Router();
routers.use('/auth', authRouter);
routers.use('/products', productRouter);

module.exports = routers;
const Express = require('express');
const Passport = require('passport');
const db = require('../../models/index');
const router = Express.Router();

// Read: index list
router.get('', Passport.authenticate('jwt', { session: false }), async (req, res) => {
	let limit = parseInt(req?.query?.page_size);
	if (!(
		limit &&
		Number.isInteger(limit) &&
		limit > 0
	)) {
		limit = 5;
	}

	let offset = parseInt(req?.query?.page); 
	if (!(
		offset &&
		Number.isInteger(offset) &&
		offset >= 0
	)) {
		offset = 0;
	}

	const products = await db.Product.findAndCountAll({
		limit,
		offset,
	});
	return res.json(products);
});

// Read: show one
router.get('/:id', Passport.authenticate('jwt', { session: false }), async (req, res) => {
	const id = parseInt(req?.params?.id);
	if (!Number.isInteger(id)) {
		res.status(422).json({ message: 'Invalid input' });
	}
	const product = await db.Product.findByPk(id);
	if (!product) {
		return res.status(404).json();
	}
	return res.json(product);
});

// Create
router.post('', Passport.authenticate('jwt', { session: false }), async (req, res) => {
	// TODO: use validator package instead

	if (!(
		req?.body?.name &&
		req?.body?.price &&
		Number.isInteger(parseInt(req.body.price)) &&
		parseInt(req.body.price) > 0
	)) {
		return res.status(422).json({ message: 'Invalid input' });
	}

	const newProduct = await db.Product.create({
		name: req.body.name,
		price: req.body.price,
		comment: req.body.comment ?? null,
	});
	await newProduct.reload();

	return res.json(newProduct);
});

// Update
router.put('/:id', Passport.authenticate('jwt', { session: false }), async (req, res) => {
	const id = parseInt(req?.params?.id);
	const product = await db.Product.findByPk(id);
	if (!product) {
		return res.status(404).json();
	}

	if (req?.body?.name) {
		product.name = req.body.name;
	}
	if (
		req?.body?.price &&
		Number.isInteger(parseInt(req.body.price)) &&
		parseInt(req.body.price) > 0
	) {
		product.price = req.body.price;
	}
	if (req?.body?.comment) {
		product.comment = req.body.comment;
	}

	await db.DataLog.writeUpdateLog(product, req.user.id);
	await product.save();
	await product.reload();

	return res.json(product);
});

// Delete
router.delete('/:id', Passport.authenticate('jwt', { session: false }), async (req, res) => {
	const id = parseInt(req?.params?.id);
	const product = await db.Product.findByPk(id);
	if (!product) {
		return res.status(404).json();
	}

	await db.DataLog.writeDeleteLog(product, req.user.id);
	await product.destroy();

	return res.json(product);
});

module.exports = router;

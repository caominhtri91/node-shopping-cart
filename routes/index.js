const express = require('express');

const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');
const {isLoggedInCheckout} = require('../middleware/isLoggedInCheckout');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  const successMsg = req.flash('success')[0];
  Product.find().then((products) => {
    const productChunks = [];
    let chunkSize = 1;
    products.forEach(() => {
      if (chunkSize % 3 === 0) {
        productChunks.push(products.slice(chunkSize - 3, chunkSize));
      }
      chunkSize += 1;
    });
    res.render('shop/index', { title: 'Shopping cart', products: productChunks, successMsg, noMessage: !successMsg });
  }).catch(err => res.status(404).send());
});

router.get('/add-to-cart/:id', (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, (err, product) => {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, productId);
    req.session.cart = cart;
    res.redirect('/');
  });
});

router.get('/reduce/:id', (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove/:id', (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart', (req, res, next) => {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', { products: null });
  }
  const cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice });
});

router.get('/checkout', isLoggedInCheckout, (req, res, next) => {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  const cart = new Cart(req.session.cart);
  const errMsg = req.flash('error')[0];
  res.render('shop/checkout', { total: cart.totalPrice, errMsg, noError: !errMsg });
});

router.post('/checkout', isLoggedInCheckout, (req, res, next) => {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  const cart = new Cart(req.session.cart);
  const stripe = require("stripe")(
    "sk_test_LYLt86M46DMzedcEe2hThwjm"
  );

  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "usd",
    source: req.body.stripeToken, // obtained with Stripe.js
    description: "Test Charge"
  }, function(err, charge) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('checkout');
    }
    const order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id
    });
    order.save((err, result) => {
      req.flash('success', 'Successfully bought product');
      req.session.cart = null;
      res.redirect('/');
    });
  });
});

module.exports = router;

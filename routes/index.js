const express = require('express');
const passport = require('passport');

const Product = require('../models/product');
const csrf = require('csurf');

const router = express.Router();

const csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', (req, res, next) => {
  Product.find().then((products) => {
    const productChunks = [];
    let chunkSize = 1;
    products.forEach((product) => {
      if (chunkSize % 3 === 0) {
        productChunks.push(products.slice(chunkSize - 3, chunkSize));
      }
      chunkSize += 1;
    });
    res.render('shop/index', { title: 'Shopping cart', products: productChunks });
  }).catch(err => res.status(404).send());
});

router.get('/user/signup', (req, res) => {
  res.render('user/signup', { csrfToken: req.csrfToken() });
});

router.post('/user/signup', passport.authenticate('local.signup', {
  successRedirect: 'profile',
  failureRedirect: 'signup',
  failureFlash: true,
}));

router.get('/user/profile', (req, res) => {
  res.render('user/profile');
});

module.exports = router;

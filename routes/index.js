var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var csrf = require('csurf');

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find().then((products) => {
    var productChunks = [];
    var chunkSize = 1;
    products.forEach((product) => {
      if (chunkSize%3 === 0) {
        productChunks.push(products.slice(chunkSize - 3, chunkSize));
      }
      chunkSize++;
    });
    res.render('shop/index', { title: 'Shopping cart', products: productChunks});
  }).catch((err) => res.status(404).send());
});

router.get('/user/signup', (req, res, next) => {
  res.render('user/signup', { csrfToken: req.csrfToken() });
});

router.post('/user/signup', (req, res, next) => {
  res.redirect('/');
});

module.exports = router;

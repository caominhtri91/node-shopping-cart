const express = require('express');
const passport = require('passport');
const csrf = require('csurf');

const {isLoggedIn} = require('../middleware/isLoggedIn');
const Order = require('../models/order');
const Cart = require('../models/cart');

const router = express.Router();

const csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, (req, res) => {
  Order.find({
    user: req.user
  }, (err, orders) => {
    if (err) {
      return res.write('Error!');
    }
    var cart;
    orders.forEach((order) => {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render('user/profile', { orders: orders });
  });
});

router.get('/logout', isLoggedIn, (req, res, next) => {
  req.logout();
  res.redirect('/');
});

router.use('/', notLoggedIn, (req, res, next) => {
  next();
});

router.get('/signup', (req, res) => {
  const messages = req.flash('error');
  res.render('user/signup', { csrfToken: req.csrfToken(), messages, hasError: messages.length > 0 });
});

router.post('/signup', passport.authenticate('local.signup', {
  failureRedirect: 'signup',
  failureFlash: true,
}), function (req, res, next) {
  if (req.session.oldUrl) {
    const oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/user/profile');
  }
});

router.get('/signin', (req, res) => {
  const messages = req.flash('error');
  res.render('user/signin', { csrfToken: req.csrfToken(), messages, hasError: messages.length > 0 });
});

router.post('/signin', passport.authenticate('local.signin', {
  failureRedirect: 'signin',
  failureFlash: true,
}), function (req, res, next) {
  if (req.session.oldUrl) {
    const oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/user/profile');
  }
});

module.exports = router;

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

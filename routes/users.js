var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Product = require('../models/product');
var passport = require('passport');
var csrfProtection = require('csurf');;
router.use(csrfProtection());
var jwt = require('jsonwebtoken');
router.get('/user/profile', isLoggedIn, (req, res, next) => {
  // var token = req.headers.authorization.split(' ')[1];

  res.render('user/profile');

});

router.get('/user/signout', isLoggedIn, (req, res, next) => {
  req.logout();
  res.redirect('/');
});

router.use('/', notLoggedIn, function (req, res, next) {
  next();
})

router.get('/user/signup', (req, res, next) => {
  var messages = req.flash('error');
  res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages });
});

router.post('/user/signup', passport.authenticate('local.signup', {
  successRedirect: 'profile',
  failureRedirect: 'signup',
  failureFlash: true
}));

router.get('/user/signin', (req, res, next) => {
  var messages = req.flash('error');
  res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages });
});

router.post('/user/signin', passport.authenticate('local.signin',{
  successRedirect:'profile',
  failureRedirect:'signin',
  failureFlash:true
}));



function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
module.exports = router;

const express = require('express');
const wrapAsync = require('../utilities/wrapAsync.js');
const passport = require('passport');
const userController = require('../controllers/user.js');

const { redirectUrlSave } = require('../middleware.js');

const router = express.Router();


// sign up
router
    .route('/signup')
    .get (userController.signupForm)
    .post(wrapAsync (userController.signup));


// log in
router
    .route('/login')
    .get (userController.loginForm)
    .post(redirectUrlSave, passport.authenticate("local", {failureRedirect: '/login', failureFlash: {type: 'err'}}), wrapAsync (userController.login));


// log out
router.get('/logout', userController.logout);

module.exports = router;
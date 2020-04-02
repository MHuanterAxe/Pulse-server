const { Router } = require('express');
const AuthController = require('../Controllers/AuthController')
const { check } = require('express-validator')
const router = Router();

router.post('/register',
  [
    check('email', 'Incorrect Email address').isEmail(),
    check('password', 'Incorrect password').isLength({ min: 6 })
  ],
  AuthController.register);

router.post('/login',
  [
    check('email', 'Incorrect Email address').isEmail(),
    check('password', 'Incorrect password').exists()
  ],
  AuthController.login);
module.exports = router

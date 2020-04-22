const { Router } = require('express');
const AuthMiddleWare = require('../MiddleWare/AuthMiddleWare');
const router = Router();
const UserController = require('../Controllers/UserController');

router.get('/', AuthMiddleWare, UserController.userData);

module.exports = router

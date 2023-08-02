const express = require('express');
const router = express.Router();
const {
    loginValidator,
    registerValidator,
    authProvider,
    loggingMiddleware
} = require('../middlewares');
const {
    loginController,
    registerController,
    logoutController,
    loggedInController,
    changePasswordController
} = require('../controllers/user');

router.post('/login', loggingMiddleware, loginValidator, loginController);
router.post('/register', loggingMiddleware, registerValidator, registerController);
router.get('/logout', loggingMiddleware, logoutController);
router.get('/loggedIn', loggingMiddleware, loggedInController);
router.put('/changePassword', loggingMiddleware, changePasswordController);

module.exports = router;
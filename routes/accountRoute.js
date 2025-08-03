const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities/index');
const regValidate = require('../utilities/account-validation');

// Public routes
router.get('/login', utilities.handleErrors(accountController.buildLogin));
router.get('/register', utilities.handleErrors(accountController.buildRegister));

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

router.post('/register', utilities.handleErrors(accountController.registerAccount));

// Protected route - this should work now since JWT is verified
router.get('/', utilities.checkLogin, utilities.handleErrors(accountController.accountManagement));

module.exports = router;
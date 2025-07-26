const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities/index');





router.get('/login', utilities.handleErrors(accountController.buildLogin));
router.get('/register', utilities.handleErrors(accountController.buildRegister));

router.post('/login', utilities.handleErrors(accountController.accountLogin));
router.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = router;
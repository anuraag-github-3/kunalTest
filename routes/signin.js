const express = require('express');

const signInController = require('../controllers/signin');

const router = express.Router();
router.post('/signin', signInController.addMember);

module.exports = router;
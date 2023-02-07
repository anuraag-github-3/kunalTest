const express = require('express');
const memberAuthentication = require('../middleware/auth');

const messagesController = require('../controllers/messages');

const router = express.Router();
router.get('/get-messages', memberAuthentication.authenticate, messagesController.getMessages);

router.post('/post-message', memberAuthentication.authenticate, messagesController.postMessage);



module.exports = router;
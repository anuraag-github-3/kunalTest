const express = require('express');


const memberAuthentication = require('../middleware/auth');

const membersController = require('../controllers/members');

const router = express.Router();

router.get('/memberslist/:groupId', memberAuthentication.authenticate, membersController.getMemberList);



module.exports = router;
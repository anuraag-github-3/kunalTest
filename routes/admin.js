const express = require('express');
const router = express.Router();
const memberAuthentication = require('../middleware/auth');

const adminController = require('../controllers/admin');

router.post('/makeGroupAdmin', memberAuthentication.authenticate, adminController.makeGroupAdmin);
router.get('/checkAdmin', memberAuthentication.authenticate, adminController.checkAdmin);
router.get('/getGroupAdmins/:groupId', memberAuthentication.authenticate, adminController.getGroupAdmins);
router.post('/makeNewAdmin', memberAuthentication.authenticate, adminController.createNewAdmin);
router.post('/removeAdmin', memberAuthentication.authenticate, adminController.removeAdmin);

module.exports = router;

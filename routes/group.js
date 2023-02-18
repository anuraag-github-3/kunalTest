const express = require('express');
const router = express.Router();
const memberAuthentication = require('../middleware/auth');

const groupController = require('../controllers/group');

router.get('/getUserGroups', memberAuthentication.authenticate, groupController.getUserGroups);
router.get('/checkGroupUser', memberAuthentication.authenticate, groupController.checkGroupUser);
router.post('/createGroup', memberAuthentication.authenticate, groupController.createGroup);
router.post('/groupInfo', memberAuthentication.authenticate, groupController.getGroupInfo);


router.get('/getGroupMembers/:groupID', memberAuthentication.authenticate, groupController.getGroupMembers)
//router.post('/removeFromGroup', groupController.removeFromGroup);
//router.post('/addNewGroupUser', groupController.addNewGroupUser);

module.exports = router;
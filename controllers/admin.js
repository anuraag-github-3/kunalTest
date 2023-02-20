const sequelize = require('../util/database');
const { Sequelize, Op } = require('sequelize');
const Member = require('../models/members');
const Group = require('../models/Group');
const Admin = require('../models/Admin');


const makeGroupAdmin = async (req, res) => {
    try {
        var memberId;
        console.log('body******', req.body);
        console.log('id*******', req.body.newAdminId)
        if (req.body.newAdminId) {
            memberId = +req.body.newAdminId
        }
        else {
            memberId = +req.user.id
        }

        await Admin.create({
            GroupId: +req.body.GroupId,
            memberId: memberId
        })
        res.status(200).send('Successful');
    }
    catch (err) {
        console.log(err)
        res.status(500);
    }
}


const checkAdmin = async (req, res) => {
    try {
        let userId;
        if (req.query.memberID) {
            userId = req.query.userId;
        } else {
            userId = req.user.id;
        }
        const groupAdmins = await Admin.findAll({
            where: {
                GroupId: req.query.groupId,
                memberId: userId
            }
        })
        if (groupAdmins[0]) {
            res.status(200).send(true);
        } else {
            res.status(200).send(false);
        }
    }
    catch (err) {
        console.log(err)
        res.status(500);
    }
}

const getGroupAdmins = async (req, res) => {
    try {
        const groupAdmins = await Admin.findAll({
            where: {
                GroupId: req.params.groupId,
            },
            include: {
                model: Member,
                attributes: ['userName'],
                as: 'member'
            }
        });
        const results = groupAdmins.map(admin => {
            return {
                id: admin.id,
                GroupId: admin.GroupId,
                memberId: admin.memberId,
                AdminName: admin.member.userName
            };
        });
        res.status(200).send(results);
    }
    catch (err) {
        console.log(err)
        res.status(500);
    }
}

const createNewAdmin = async (req, res) => {
    try {
        await Admin.create({
            GroupId: req.body.chatGroupId,
            memberId: req.body.userId
        })
        res.status(200).send('Successful');
    }
    catch (err) {
        console.log(err)
        res.status(500);
    }
}

const removeAdmin = async (req, res) => {
    try {
        await Admin.destroy({
            where: {
                GroupId: req.body.GroupId,
                memberId: req.body.AdminId
            }
        })
        res.status(200).send('Successful');
    }
    catch (err) {
        console.log(err)
        res.status(500);
    }
}


module.exports = {
    makeGroupAdmin,
    checkAdmin,
    getGroupAdmins,
    createNewAdmin,
    removeAdmin
}

const members = require('../models/members')
const Message = require('../models/messages');
const sequelize = require('../util/database');
const { Sequelize, Op } = require('sequelize');


require('dotenv').config();
function stringInvalid(str) {
    if (str == undefined || str.length === 0 || str == null)
        return true;
    else return false;
}

const getGroupMessages = async (req, res) => {
    try {
        const messages = await Message.findAll({
            where: {
                GroupId: req.params.groupId,
            },
            include: {
                model: members,
                attributes: ['userName', 'picLink']
            },
        });

        const response = messages.map(message => ({
            memberName: message.member.userName,
            memberPic: message.member.picLink,
            message: message.message,
            time: message.createdAt
        }));
        res.status(200).json(response);
    }
    catch (err) {
        console.error(err);
        res.status(400).json(null);
    }
}

const newGroupMessage = async (req, res) => {
    try {

        const member = await members.findOne({
            where: {
                id: req.body.memberID
            }
        });
        const newMessage = await Message.create({

            message: req.body.message,
            GroupId: req.body.chatGroupId,
            memberId: req.body.memberID
        });
        const response = [{
            memberName: member.userName,
            memberPic: member.picLink,
            message: newMessage.message,
            time: newMessage.createdAt
        }]

        res.status(200).json(response);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(null);
    }
}





module.exports = {

    getGroupMessages,
    newGroupMessage
}

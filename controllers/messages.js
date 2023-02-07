const members = require('../models/members')
const messages = require('../models/messages');
const Sequelize = require('sequelize');

require('dotenv').config();
function stringInvalid(str) {
    if (str == undefined || str.length === 0 || str == null)
        return true;
    else return false;
}

const postMessage = async (req, res) => {
    try {
        const message = req.body.message;
        const memberId = req.user.id;
        const foundMember = await members.findByPk(memberId);


        if (stringInvalid(message) || stringInvalid(memberId)) {
            return res.status(400).json({ success: false, err: "Missing input parameters" });
        }
        const data = await messages.create({
            message: message,
            memberId: memberId
        })

        messageDetails = {
            memberName: foundMember.userName,
            message: data.message,
            createdAt: data.createdAt

        }
        return res.status(201).json({ success: true, messagesData: messageDetails });
    } catch (err) {

        return res.status(403).json({
            success: false,
            error: err
        })
    }
}

const getMessages = async (req, res) => {
    try {
        const messageList = await messages.findAll({
            include: [{
                model: members,
                attributes: ['userName'],
                where: {
                    id: Sequelize.col('messages.memberId')
                }
            }]
        });

        const messagesArray = messageList.map(message => ({
            memberName: message.member.userName,
            message: message.message,
            createdAt: message.createdAt,
        }));
        console.log(messagesArray);

        return res.status(200).json({
            messages: messagesArray
        });
    } catch (err) {
        return res.status(402).json({
            success: false,
            error: err,
        });
    }
};


module.exports = {
    postMessage,
    getMessages
}
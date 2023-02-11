const members = require('../models/members')
const messages = require('../models/messages');
const { Sequelize, Op } = require('sequelize');


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
            msgID: data.id,
            memberName: foundMember.userName,
            message: data.message,
            createdAt: data.createdAt,
            id: data.id

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
        const lastMessageID = parseInt(req.query.messageID);
        console.log('*******', lastMessageID);
        var messageList;
        if (lastMessageID == 0) {
            messageList = await messages.findAll({
                include: [{
                    model: members,
                    attributes: ['userName'],
                    where: {
                        id: Sequelize.col('messages.memberId')
                    }
                }]
            })

        }
        else {
            try {
                messageList = await messages.findAll({
                    include: [{
                        model: members,
                        attributes: ['userName'],
                        where: {
                            id: Sequelize.col('messages.memberId')
                        }
                    }],
                    where: {
                        id: {
                            [Op.gt]: lastMessageID
                        }
                    }
                });

            } catch (err) {
                console.error(err);
            }
        }
        const messagesArray = messageList.map(message => ({
            memberName: message.member.userName,
            message: message.message,
            createdAt: message.createdAt,
            id: message.id
        }));


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

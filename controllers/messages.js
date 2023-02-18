const members = require('../models/members')
const Message = require('../models/messages');
const AWS = require('aws-sdk');
const sequelize = require('../util/database');
const { Sequelize, Op } = require('sequelize');

const dotenv = require('dotenv');
dotenv.config();

require('dotenv').config();


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

const uploadToS3 = (data, filename) => {

    let s3bucket = new AWS.S3({
        accessKeyId: process.env.IAM_KEY,
        secretAccessKey: process.env.IAM_SECRET_KEY
    })
    var params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }
    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log('Something went wrong', err);
                reject(err)
            }
            else {
                console.log('success', s3response)
                resolve(s3response.Location)

            }
        });
    })

}


const saveFile = async (req, res) => {
    try {
        const file = req.body.file[0];
        const fileName = `file${req.user.id}${new Date()}`;
        const fileURL = await uploadToS3(file, fileName);
        console.log(fileURL);
        res.status(200).send(fileURL);

        await req.user.createMessage({
            memberId: req.user.id,
            message: fileURL,
            GroupId: req.params.groupId
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json(null);
    }
}


module.exports = {
    getGroupMessages,
    newGroupMessage,
    saveFile,
    uploadToS3
}

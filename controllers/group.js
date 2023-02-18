const sequelize = require('../util/database');
const { Sequelize, Op } = require('sequelize');
const Member = require('../models/members');
const Group = require('../models/Group');
const Message = require('../models/messages');
const GroupMember = require('../models/GroupMember');


const createGroup = async (req, res) => {
    try {
        console.log('***');
        const adminID = req.user.id;

        const newGroup = await Group.create({
            name: req.body.groupName,
            groupPhoto: req.body.groupPhoto,
            createdBy: adminID
        });

        const groupMembers = req.body.groupMembers;
        groupMembers.push(adminID);

        groupMembers.forEach(async memberId => {
            await newGroup.addMember(memberId, { through: 'GroupMembers' });
        })

        console.log(newGroup);
        res.status(200).json(newGroup);

    }
    catch (err) {
        console.error(err);
        res.status(400).json(null);
    }
}

const getUserGroups = async (req, res) => {
    try {
        const userGroups = await Member.findOne({
            where: {
                id: req.user.id
            },
            include: {
                model: Group
            }
        })
        const userGroupsJSON = userGroups.toJSON();

        for (let group of userGroupsJSON.Groups) {
            const creator = await Member.findOne({
                where: {
                    id: group.createdBy
                }
            });

            group.createdByName = creator.userName;

        }
        res.status(200).json(userGroupsJSON);
    }
    catch (err) {
        console.error(err);
        res.status(400).json(null);
    }
}
const getGroupInfo = async (req, res) => {

    try {
        const groupID = req.body.id;

        const groupInfo = await Group.findByPk(groupID);

        const groupAdminName = await Member.findByPk(groupInfo.createdBy);



        const groupDetails = {
            groupAdmin: groupAdminName.userName,
            groupID: groupInfo.id,
            groupName: groupInfo.name,
            groupPhotoURL: groupInfo.groupPhoto,
        };

        res.status(200).json(groupDetails);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Internal server error' });
    }

}

const getGroupMembers = async (req, res) => {
    try {

        const groupID = req.params.groupID;
        const group = await Group.findByPk(groupID, {
            include: [{ model: Member }]
        });

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const memberlist = group.members.map(member => ({
            id: member.id,
            name: member.userName
        }));

        return res.json({ memberlist });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
}

const checkGroupUser = async (req, res) => {
    try {
        const isParticipant = await GroupMember.findOne({
            where: {
                GroupId: req.query.groupId,
                memberId: req.query.userId
            },
            attributes: ['GroupId', 'memberId']
        })
        if (isParticipant) {
            res.status(200).send(true);
        } else {
            res.status(200).send(false);
        }
    }
    catch (err) {
        console.error(err);
        res.status(400).json(null);
    }
}

const removeFromGroup = async (req, res) => {
    try {
        await GroupUser.destroy({
            where: {
                GroupId: req.body.GroupId,
                memberId: req.body.userId
            }
        });
        res.status(200).send('Successful');
    }
    catch (err) {
        console.error(err);
        res.status(400).json(null);
    }
}

const addNewGroupUser = async (req, res) => {
    try {
        const group = await Group.findOne({
            where: {
                id: req.body.GroupId
            }
        });
        await group.addUser(req.body.userId, { through: 'GroupUsers' });
        res.status(200).send('Successful');
    }
    catch (err) {
        console.error(err);
        res.status(400).json(null);
    }
}

module.exports = {
    createGroup,
    getUserGroups,
    getGroupInfo,
    getGroupMembers,
    checkGroupUser,
    removeFromGroup,
    addNewGroupUser
}


const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const GroupMember = sequelize.define('GroupUser', {
    chatGroupId: {
        type: Sequelize.INTEGER,
        allowNul: false
    },
    memberId: {
        type: Sequelize.INTEGER,
        allowNul: false
    }
}, {
    timestamps: false
});

module.exports = GroupMember;
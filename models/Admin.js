const Sequelize = require('sequelize');
const sequelize = require('../util/database');


const Admin = sequelize.define('Admin', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    GroupId: {
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

module.exports = Admin;
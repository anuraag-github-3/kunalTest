const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const members = sequelize.define('members', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    userName: { type: Sequelize.STRING },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: Sequelize.STRING
    },
    picLink: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING

    }

});
module.exports = members;
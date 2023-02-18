const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Group = sequelize.define('Groups', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNul: false
    },
    name: {
        type: Sequelize.STRING,
        allowNul: false
    },
    groupPhoto: {
        type: Sequelize.STRING
    },
    createdBy: {
        type: Sequelize.STRING,
        allowNul: false
    }
}, {
    timestamps: false
});



module.exports = Group;
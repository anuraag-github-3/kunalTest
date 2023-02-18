const members = require('../models/members');
const { Op } = require("sequelize");
const groups = require('../models/Group');
require('dotenv').config();
function stringInvalid(str) {
    if (str == undefined || str.length === 0 || str == null)
        return true;
    else return false;
}


const getMemberList = async (req, res) => {
    try {
        let getMembers;
        const memberID = req.user.id;
        if (req.params.groupId) {

            getMembers = await members.findAll({
                where: {
                    id: {
                        [Op.not]: req.user.id
                    }
                }
            });
        }


        const memberList = getMembers.filter(member => member.id !== memberID)
            .map(member => ({ name: member.userName, id: member.id }));

        return res.status(200).json(Object.values(memberList));


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while retrieving the member list." });
    }

}
module.exports = {
    getMemberList
}
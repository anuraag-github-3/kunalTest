require('dotenv').config();
const jwt = require('jsonwebtoken');
const member = require('../models/members');

const authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization');

        const memberFound = jwt.verify(token, process.env.SECRET_KEY);

        member.findByPk(memberFound.userId).then(memberOBJECT => {

            console.log(JSON.stringify(memberOBJECT));
            req.user = memberOBJECT;
            next();
        })
    } catch (err) {
        console.log(err);
        return res.status(401).json({ success: false })
    }
}
module.exports = {
    authenticate
}
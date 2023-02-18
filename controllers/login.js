const member = require('../models/members');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const generateAccessToken = (id, name, picLink) => {
    return jwt.sign({ userId: id, userName: name, picLink: picLink }, process.env.JWT_SECRET);
}

function stringInvalid(str) {
    if (str == undefined || str.length == 0 || str == null)
        return true;
    else return false;
}


const login = async (req, res) => {
    const mail = req.body.mail;
    const password = req.body.password;


    if (stringInvalid(password) || stringInvalid(mail)) {
        return res.status(400).json({ success: false, error: "Missing input parameters" });
    }

    try {
        const members = await member.findAll({ where: { email: mail } });


        if (members.length === 0) {
            return res.status(401).json({ success: false, message: 'User does not exist' });
        }

        const memberfound = members[0];
        const isPasswordValid = await bcrypt.compare(password, memberfound.password);

        if (isPasswordValid) {
            return res.status(200).json({
                success: true,
                message: 'Successfully Logged IN',
                token: generateAccessToken(memberfound.id, memberfound.userName, memberfound.picLink)
            });
        } else {
            return res.status(401).json({ success: false, message: 'Password incorrect' });
        }
    } catch (err) {
        res.status(500).json({ message: err, success: false });
    }
};

module.exports = {
    login
}

const member = require('../models/members');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const generateAccessToken = (id, name) => {
    return jwt.sign({ userId: id, userName: name }, process.env.JWT_SECRET);
}

function stringInvalid(str) {
    if (str == undefined || str.length == 0 || str == null)
        return true;
    else return false;
}

const login = async (req, res) => {
    try {

        const mail = req.body.mail;
        const password = req.body.password;

        if (stringInvalid(password) || stringInvalid(mail)) {

            return res.status(400).json({ success: false, error: "Missing input parameters" });

        }
        await member.findAll({ where: { email: mail } }).then(member => {
            if (member.length > 0) {

                bcrypt.compare(password, member[0].password, (err, response) => {
                    if (err) {
                        console.log("password", password, typeof password);
                        console.log("member[0].password", member[0].password, typeof member[0].password);
                        return res.json({ success: false, message: 'something went wrong' });
                    }
                    if (response) {
                        return res.status(200).json({ success: true, message: 'Successfully Logged IN', token: generateAccessToken(member[0].id, member[0].userName) });
                    }
                    else {
                        return res.status(401).json({ success: false, message: 'password incorrect' })
                    }
                })

            }
            else {
                return res.status(401).json({ success: false, message: 'User doesnt exist' });
            }

        })
    } catch (err) {

        res.status(500).json({ message: err, success: false })
    }
}
module.exports = {
    login
}



/*
const member = require('../models/members');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateAccessToken = (id, name) => {
    return jwt.sign({ userId: id, userName: name }, process.env.JWT_SECRET);
};

function isStringInvalid(str) {
    return str == undefined || str.length == 0 || str == null;
}

const login = async (req, res) => {
    try {
        const email = req.body.mail;
        const password = req.body.password;

        if (isStringInvalid(email) || isStringInvalid(password)) {
            return res.status(400).json({
                success: false,
                error: "Missing email or password in the request body",
            });
        }

        const members = await member.findAll({ where: { email } });
        if (members.length === 0) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        const member = members[0];
        const isPasswordCorrect = await bcrypt.compare(password, member.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: 'Incorrect password' });
        }

        return res.status(200).json({
            success: true,
            message: 'Successfully logged in',
            token: generateAccessToken(member.id, member.userName),
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while logging in",
            success: false,
            error,
        });
    }
};

module.exports = {
    login,
};*/

const member = require('../models/members');
const bcrypt = require('bcrypt');

function stringInvalid(str) {
    if (str == undefined || str.length == 0 || str == null)
        return true;
    else return false;
}
exports.addMember = async (req, res) => {
    try {

        const userName = req.body.userName;
        const email = req.body.email;
        const phone = req.body.phone;
        const password = req.body.password;
        if (stringInvalid(userName) || stringInvalid(email) || stringInvalid(phone) || stringInvalid(password)) {
            return res.status(400).json({ err: "Missing input parameters" })
        }
        bcrypt.hash(password, 10, async (err, hash) => {
            await member.create({
                userName: userName,
                email: email,
                phone: phone,
                password: hash
            })
            res.status(201).json({ message: 'Successfully created new user. Login!!' });
        })



    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Oopss! User exists Already!! PLease Login or try another email'
        })
    }
}

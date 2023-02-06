const member = require('../models/members');
const bcrypt = require('bcrypt');



function stringInvalid(str) {
    if (str == undefined || str.length == 0 || str == null)
        return true;
    else return false;
}

const login = async (req, res) => {
    try {

        const mail = req.body.mail;
        const password = req.body.password;
        console.log('***********', mail, password);

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

                        return res.status(200).json({ success: true, message: 'Successfully Logged IN' });
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

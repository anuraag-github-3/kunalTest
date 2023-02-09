const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');



var cors = require('cors');

const sequelize = require('./util/database');

const members = require('./models/members');
const messages = require('./models/messages');

const signinRoute = require('./routes/signin');
const loginRoute = require('./routes/login');
const messagesRoutes = require('./routes/messages');

const PORT = process.env.port

const app = express();


app.use(cors({
    origin: "*",
    credentials: true,
}));
app.use(bodyParser.json());
app.use(helmet());


app.use('/newUser', signinRoute);
app.use('/user', loginRoute);
app.use('/message', messagesRoutes);


members.hasMany(messages);
messages.belongsTo(members);


sequelize.sync().then(result => {

    app.listen(PORT);
})
    .catch(err => {
        console.log(err);
    })



const express = require('express');
const bodyParser = require('body-parser');


var cors = require('cors');

const sequelize = require('./util/database');

const signinRoute = require('./routes/signin');
const loginRoute = require('./routes/login');

const PORT = process.env.port

const app = express();
app.use(cors({
    origin: "*",
    credentials: true,
}));
app.use(bodyParser.json());

app.use('/newUser', signinRoute);
app.use('/user', loginRoute);

sequelize.sync().then(result => {

    app.listen(PORT);
})
    .catch(err => {
        console.log(err);
    })



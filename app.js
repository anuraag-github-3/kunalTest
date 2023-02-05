const express = require('express');
const bodyParser = require('body-parser');


var cors = require('cors');

const sequelize = require('./util/database');

const signinRoute = require('./routes/signin');

const PORT = process.env.port || 3000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/newUser', signinRoute);

sequelize.sync().then(result => {

    app.listen(PORT);
})
    .catch(err => {
        console.log(err);
    })



const dotenv = require('dotenv');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
var cors = require('cors');


dotenv.config();
const app = express();
//console.log('** path join', path.join(__dirname, "/views"))

const staticPath = path.join(__dirname, "/views")
//console.log('*** dir name', __dirname)
const sequelize = require('./util/database');

const members = require('./models/members');
const messages = require('./models/messages');
const group = require('./models/Group');
const admin = require('./models/Admin');

app.use(cors({
    origin: "*",
    credentials: true,
}));
app.use(bodyParser.json());
app.use(helmet());
app.use(compression());
app.use(express.static(staticPath));


const signinRoute = require('./routes/signin');
const loginRoute = require('./routes/login');
const messagesRoutes = require('./routes/messages');
const membersRoute = require('./routes/members');
const groupRoute = require('./routes/group');
const adminRoutes = require('./routes/admin');

const PORT = process.env.port || 3000







app.use('/newUser', signinRoute);
app.use('/user', loginRoute);
app.use('/message', messagesRoutes);
app.use('/members', membersRoute);
app.use('/group', groupRoute);
app.use('/admin', adminRoutes);


group.belongsToMany(members, { through: 'GroupUsers' });
members.belongsToMany(group, { through: 'GroupUsers' })

members.hasMany(messages);
messages.belongsTo(members);

admin.belongsTo(members);
members.hasMany(admin);


messages.belongsTo(group, { constraints: true, onDelete: 'CASCADE' });
messages.belongsTo(members, { constraints: true, onDelete: 'CASCADE' });


sequelize.sync().then(result => {

    app.listen(PORT);
    console.log(`Server started running at : ${PORT}`);
})
    .catch(err => {
        console.log(err);
    })



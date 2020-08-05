const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require("express-session");
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const cors = require('cors');
const app = express();
const ews = require('express-ws')(app);
const WS = require('ws');


const authApi = require('./routes/auth-api');

const Users = require('./db/users');

Users.createUser('Admin', '2');

if (false) {
    console.log('Using CORS to allow all origins');
    app.use(cors());
}

app.use(bodyParser.urlencoded({ extended: true }));


app.use(bodyParser.json());


app.ws('/', function (socket, req) {
    console.log('Established a new WS connection');

});





app.use(session({
    secret: 'a secret used to encrypt the session cookies',
    resave: false,
    saveUninitialized: false
}));


app.use(express.static('public'));





passport.use(new LocalStrategy(
    {
        usernameField: 'userId',
        passwordField: 'password'
    },
    function (userId, password, done) {

        const ok = Users.verifyUser(userId, password);

        if (!ok) {
            return done(null, false, {message: 'Invalid username/password'});
        }

        const user = Users.getUser(userId);
        return done(null, user);
    }
));


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {

    const user = Users.getUser(id);

    if (user) {
        done(null, user);
    } else {
        done(null, false);
    }
});

app.use(passport.initialize());
app.use(passport.session());


//--- Routes -----------
app.use('/api', authApi);
//app.use('/api', lootBox)


//handling 404
app.use((req, res, next) => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'public', 'index.html'));
});

module.exports = {app};

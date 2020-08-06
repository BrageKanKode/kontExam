// https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/src/server/app.js
//This code is from a lecture, and is fitted for this assignment

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require("express-session");
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const cors = require('cors');
const auctions = require("./db/auctions");
const app = express();
const ews = require('express-ws')(app);
const WS = require('ws');

const authApi = require('./routes/auth-api');
const Users = require('./db/users');

//const WsHandler = require('./ws-handler');


//Some default users
Users.createUser("Brage", "1234");
Users.createUser("Jonatan", "1234");
Users.createUser("Andrea", "1234");
Users.createUser("Jon", "1234");



//to handle JSON payloads
app.use(bodyParser.json());

//WsHandler.init(app);

app.ws('/', function (socket, req) {
    console.log('Established a new WS connection');

});


app.get('/api/auctions', (req, res) => {

    res.json(auctions.getAllAuctions());
});

app.get('/api/auctions/:id', (req, res) => {
    const auction = auctions.getAuction(req.params["id"]);

    if (!auction){
        res.status(404);
        res.send();
    } else {
        res.json(auction)
    }

});

app.delete('/api/auctions/:id', (req, res) => {
    const deleted = auctions.deleteAuction(req.params.id);
    if (deleted){
        res.status(204);
    } else {
        res.status(404);
    }

    res.send();
});

app.post('/api/auctions', (req, res) => {

    const dto = req.body;

    const id = auctions.createNewAuction(dto.name, dto.description, dto.price, dto.currentBid, dto.userId, dto.available);
    res.status(201);
    res.header("location", "api/auctions/" + id);
    res.send();

});

app.put('/api/auctions/:id', (req, res) => {
    if (req.params.id !== req.body.id){
        res.status(409);
        res.send();
        return;
    }

    const updated = auctions.updateAuction(req.body);

    if (updated){
        res.status(204);
    } else {
        res.status(404);
    }

    res.send();
});

app.all('/api/auctions/*', (req,res) => {
    res.status(404);
    res.send();
});


app.use(session({
    secret: 'a secret used to encrypt the session cookies',
    resave: false,
    saveUninitialized: false
}));


//needed to server static files, like HTML, CSS and JS.
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

//handling 404
app.use((req, res, next) => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'public', 'index.html'));
});

module.exports = {app};

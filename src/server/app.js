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
Users.createUser("Joakim", "1234");
Users.createUser("Jon", "4321");
Users.createUser("Brage", "111111");
Users.createUser("Andrea", "andrea123");



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
    const test = req.params["id"]
    console.log(test)
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

    const id = auctions.createNewAuction(dto.name, dto.description, dto.price);
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

/////////////chat/////////////

let counter = 0;

const messages = [];

app.get('/api/messages', (req, res) => {

    const since = req.query["since"];

    const data = messages;

    if (since) {
        res.json(data.filter(m => m.id > since));
    } else {
        res.json(data);
    }
});


app.post('/api/messages', (req, res) => {

    const dto = req.body;

    const id = counter++;

    const msg = {id: id, author: dto.author, text: dto.text};


    messages.push(msg);



    res.status(201); //created
    res.send();

    const nclients = ews.getWss().clients.size;
    console.log("Going to broadcast message to " + nclients +" clients");

    ews.getWss().clients.forEach((client) => {
        if (client.readyState === WS.OPEN) {
            const json = JSON.stringify(msg);
            console.log("Broadcasting to client: " + JSON.stringify(msg));
            client.send(json);
        } else {
            console.log("Client not ready");
        }
    });
});

function clearMessages(){
    //yep, that's how you "clear" an array in JS...
    messages.length = 0;
}


///////////////////////////
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

module.exports = {app, clearMessages};

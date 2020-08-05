const {app} = require('./app');
const auctions = require('./db/auctions');

const port = process.env.PORT || 8080;

app.listen(port, () => {
    auctions.initWithAuctions();
    console.log('Started server on port ' + port);
});
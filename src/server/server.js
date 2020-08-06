//https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-10/src/server/server.js
//This code is from a lecture, and is fitted for this assignment
const {app} = require('./app');
const auctions = require('./db/auctions');

const port = process.env.PORT || 8080;

app.listen(port, () => {
    auctions.initWithAuctions();
    console.log('Started server on port ' + port);
});
//https://github.com/arcuri82/web_development_and_api_design/blob/master/les07/server_client_together/tests/server/app-test.js
const request = require('supertest');

const {app} = require('../../src/server/app');
const db = require('../../src/server/db/auctions');

beforeEach(() => {db.initWithAuctions();});

test("Test get all", async () =>{


    const response = await request(app).get('/api/auctions');

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(3);
});


test("Test not found menu", async () =>{
    const response = await request(app).get('/api/auctions/-345');

    expect(response.statusCode).toBe(404);
});


test("Test retrieve each single menu item", async () => {

    const responseAll = await request(app).get('/api/auctions');
    expect(responseAll.statusCode).toBe(200);

    const auctions = responseAll.body;
    expect(auctions.length).toBe(3);

    for (let i=0; i<auctions.length; i++){
        const res = await request(app).get('/api/auctions/'+auctions[i].id);
        const menuItem = res.body;

        expect(menuItem.name).toBe(auctions[i].name);
    }
});

//TODO: FIX THIS TEST

test("Test create auction", async () => {

    const user = request.agent(app);

    const signup = await user.post('/api/signup')
        .send({userId:'foo', password:"bar"})
        .set('Content-Type', 'application/json');

    expect(signup.statusCode).toBe(201);

    const response = await user.post('/api/auctions');

    expect(response.statusCode).toBe(201);

    const response1 = await user.post('/api/create');
    expect(response1.statusCode).toBe(200);


    let responseAll = await request(app).get('/api/auctions');
    const n = responseAll.body.length;

    const name = "foo";

    const resPost = await request(app)
        .post('/api/create')
        .send({name:name, description: "bar"})
        .set('Content-Type', 'application/json');

    expect(resPost.statusCode).toBe(200);
    const location = resPost.header.location;

    responseAll = await request(app).get('/api/auctions');
    expect(responseAll.body.length).toBe(n);

    const resGet = await request(app).get('/api/auctions');
    expect(resGet.statusCode).toBe(200);
    //expect(resGet.body.name).toBe(name);

});




test("Delete all Auctions", async () => {
    let responseAll = await request(app).get('/api/auctions');
    expect(responseAll.statusCode).toBe(200);

    const auctions = responseAll.body;
    expect(auctions.length).toBe(3);

    for (let i = 0; i < auctions.length; i++){
        const res = await request(app).delete('/api/auctions/'+auctions[i].id);
        expect(res.statusCode).toBe(204);
    }

    responseAll = await request(app).get('/api/auctions');
    expect(responseAll.statusCode).toBe(200);
    expect(responseAll.body.length).toBe(0);
});




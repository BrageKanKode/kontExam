//https://github.com/arcuri82/web_development_and_api_design/blob/master/les08/authentication/tests/server/routes-test.js

const request = require('supertest');
const {app} = require('../../src/server/app');
const Users = require('../../src/server/db/users');

let counter = 0;

beforeEach(() => {Users.resetAllUsers();});

test("Test failed login", async () => {
    const response = await request(app)
        .post('/api/login')
        .send({userId: 'foo', password: '123'});

    expect(response.statusCode).toBe(401)
});

test("Test sign up", async () =>{

    const response = await request(app)
        .post('/api/signup')
        .send({userId: 'foo', password: '123'});

    expect(response.statusCode).toBe(201);
});

test("Test fail sign up twice", async () =>{

    const payload = {userId: 'foo', password: '123'};

    let response = await request(app)
        .post('/api/signup')
        .send(payload);
    expect(response.statusCode).toBe(201);

    //can't sign up twice with same userId
    response = await request(app)
        .post('/api/signup')
        .send(payload);
    expect(response.statusCode).toBe(400);
});

test("Test fail access data of non-existent user", async () =>{

    const response = await request(app)
        .get('/api/user');

    expect(response.statusCode).toBe(401);
});

test("Test create user, but fail get data", async () =>{

    const userId = 'foo_' + (counter++);

    let response = await request(app)
        .post('/api/signup')
        .send({userId, password:"bar"})
        .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(201);


    //no use of cookies here, so auth fails
    response = await request(app)
        .get('/api/user');

    expect(response.statusCode).toBe(401);
});

test("Test create user and get data", async () =>{

    const userId = 'foo_' + (counter++);

    //use same cookie jar for the HTTP requests
    const agent = request.agent(app);

    let response = await agent
        .post('/api/signup')
        .send({userId, password:"bar"})
        .set('Content-Type', 'application/json');

    expect(response.statusCode).toBe(201);


    //using same cookie got from previous HTTP call
    response = await agent.get('/api/user');

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(userId);
    expect(response.body.password).toBeUndefined();
});

test("Test create user, login in a different session and get data", async () =>{

    const userId = 'foo_' + (counter++);

    //create user, but ignore cookie set with the HTTP response
    let response = await request(app)
        .post('/api/signup')
        .send({userId, password:"bar"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(201);


    //use new cookie jar for the HTTP requests
    const agent = request.agent(app);

    //do login, which will get a new cookie
    response = await agent
        .post('/api/login')
        .send({userId, password:"bar"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(204);


    //using same cookie got from previous HTTP call
    response = await agent.get('/api/user');

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(userId);
    expect(response.body.password).toBeUndefined();
});




test("Test login after logout", async () =>{

    const userId = 'foo_' + (counter++);

    //use same cookie jar for the HTTP requests
    const agent = request.agent(app);

    //create user
    let response = await agent
        .post('/api/signup')
        .send({userId, password:"bar"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(201);


    //can get info
    response = await agent.get('/api/user');
    expect(response.statusCode).toBe(200);


    //now logout
    response = await agent.post('/api/logout');
    expect(response.statusCode).toBe(204);


    //after logout, should fail to get data
    response = await agent.get('/api/user');
    expect(response.statusCode).toBe(401);

    //do login
    response = await agent
        .post('/api/login')
        .send({userId, password:"bar"})
        .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(204);


    //after logging in again, can get info
    response = await agent.get('/api/user');
    expect(response.statusCode).toBe(200);
});

test("Test logout", async () =>{

    const payload = {userId: "foo", password: "123"};

    let response = await request(app)
        .post('/api/signup')
        .send(payload);
    expect(response.statusCode).toBe(201);
    const cookie = response.headers['set-cookie'];

    //now we should be able to get it
    response = await request(app)
        .get('/api/user')
        .set('cookie', cookie);
    expect(response.statusCode).toBe(200);

    await  request(app)
        .post('/api/logout')
        .set('cookie', cookie)
        .send();

    //the cookie is no longer valid now after a logout
    response = await request(app)
        .get('/api/user')
        .set('cookie', cookie);
    expect(response.statusCode).toBe(401);
});



const React = require('react');
const {mount} = require('enzyme');
const {MemoryRouter} = require('react-router-dom');

const {Auctions} = require('../../src/client/auctions');
const {stubFetch, flushPromises, overrideFetch, asyncCheckCondition} = require('../mytest-utils');
const db = require('../../src/server/db/auctions');
const {app} = require('../../src/server/app');


let server;
let port;

beforeAll(done => {

    server = app.listen(0, () => {
        port = server.address().port;
        done();
    });
});

afterAll(() => {
    server.close();
});

test("Test display menuItems using SuperTest", async () => {

    db.initWithAuctions();
    overrideFetch(app);

    const driver = mount(
        <MemoryRouter initialEntries={["/auctions"]}>
            <Auctions/>
        </MemoryRouter>
    );

    const predicate = () => {

        driver.update();
        const tableSearch = driver.find('.completeMenu');
        const tableIsDisplayed =  (tableSearch.length >= 1);
        return tableIsDisplayed;
    };

    const displayedTable = await asyncCheckCondition(predicate, 3000, 200);
    expect(displayedTable).toBe(true);

    const menuItems = db.getAllAuctions();
    const html = driver.html();

    for(let i=0; i<menuItems.length; i++){
        expect(html).toMatch(menuItems[i].name);
    }
});





test("Test display 1 menuItem using stub", async () => {

    const name = "Pizza Parma";

    stubFetch(
        200,
        [{id:0, name: name, description: "Delicious pizza parma from italy", dayOfWeek: "Monday"}],
        (url) => url.endsWith("/api/auctions")
    );


    const driver = mount(
        <MemoryRouter initialEntries={["/auctions"]}>
            <Auctions/>
        </MemoryRouter>
    );

    await flushPromises();

    const html = driver.html();


    expect(html).toMatch(name);
});

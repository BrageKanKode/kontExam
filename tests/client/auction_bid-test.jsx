const React = require('react');
const {mount} = require('enzyme');
const {MemoryRouter} = require('react-router-dom');
const {AuctionBid} = require('../../src/client/auction_bid');


test('Test can render auction_bid form', () => {
    const driver = mount(
        <MemoryRouter>
            <AuctionBid/>
        </MemoryRouter>
    );


    const form = driver.find('#submitBtn');
    expect(form.length).toEqual(1);

    const btns = driver.find('#AuctionPrice');
    expect(btns.length).toEqual(1);
});
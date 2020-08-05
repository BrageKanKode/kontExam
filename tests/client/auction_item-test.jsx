const React = require('react');
const {mount} = require('enzyme');
const {MemoryRouter} = require('react-router-dom');
const {AuctionItem} = require('../../src/client/auction_item');

test('Test can render menu_item form', () => {
    const driver = mount(
        <MemoryRouter>
            <AuctionItem/>
        </MemoryRouter>
    );

    const forms = driver.find('#auctionName');
    expect(forms.length).toEqual(1);

    const btns = driver.find('#auctionDescription');
    expect(btns.length).toEqual(1);
});
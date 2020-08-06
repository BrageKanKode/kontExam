

const auctions = new Map();



function initWithAuctions() {
    auctions.clear();
    counter = 0;

    createNewAuction("Motorcycle", "Good motorcycle", 900, 0, 0, true);
    createNewAuction("Car", "It's red", 1000,0,  0, true);
    createNewAuction("Burger", "Our classic burger", 100,0,  0, false);


}
let counter = 1;

function createNewAuction(name, description, price, currentBid, userId, available){
    const id = "" + counter;
    counter++;

    const menuItem = {
        id: id,
        name: name,
        description: description,
        price: price,
        currentBid: currentBid,
        available: available,
        userId: userId
    };

    auctions.set(id, menuItem);
    return id;
}

function deleteAuction(id) {
    return auctions.delete(id)
}

function getAuction(id) {
    return auctions.get(id)
}

function getAllAuctions() {
    return Array.from(auctions.values())
}

function updateAuction(auctionId) {
    if (!auctions.has(auctionId.id)){
        return false;
    }

    auctions.set(auctionId.id, auctionId);
    return true;
}

module.exports = {initWithAuctions, getAuction, getAllAuctions, createNewAuction, updateAuction, deleteAuction };
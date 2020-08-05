

const auctions = new Map();

let counter = 0;

function initWithAuctions() {
    auctions.clear();
    counter = 0;

    createNewAuction("Motorcycle", "Good motorcycle", "900");
    createNewAuction("Car", "It's red", "1000");
    createNewAuction("Burger", "Our classic burger", "100");


}

function createNewAuction(name, description, price){
    const id = "" + counter;
    counter++;

    const menuItem = {
        id: id,
        name: name,
        description: description,
        price: price
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

function updateAuction(menuItem) {
    if (!auctions.has(menuItem.id)){
        return false;
    }

    auctions.set(menuItem.id, menuItem);
    return true;
}

module.exports = {initWithAuctions, getAuction, getAllAuctions, createNewAuction, updateAuction, deleteAuction };
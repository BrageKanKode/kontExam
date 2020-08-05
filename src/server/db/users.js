
const users = new Map();



function getUser(id){

    return users.get(id);
}


function verifyUser(id, password){

    const user = getUser(id);

    if(!user){
        return false;
    }

    return user.password === password;
}

let userId = 0;
function createUser(id, password){
    userId++;

    if(getUser(id)){
        return false;
    }

    const user = {
        id: id,
        userId: userId,
        password: password
    };


    users.set(id, user);
    return true;
}


function resetAllUsers(){
    users.clear();
}





module.exports = {getUser, verifyUser, createUser, resetAllUsers};
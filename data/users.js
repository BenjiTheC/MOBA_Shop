const mongoCollections = require("./collections");
const users = mongoCollections.users;

const exportedMethod = {

    async getAllUsers(){
        const userCollection = await users();
        const allUser = await userCollection.find({}).toArray();
        return allUser;
    },

    async getUserById(id){
        if (!id) throw "you must provide an id to search for"
        const userCollection = await users();
        const user = await userCollection.findOne({_id: id})
        if (user ===null) throw "no user with that id"
        return user
    },
    //what information must be provided ?
    //structure of User:
    //userID: unique ID for registered users
    //userInfo: a sub-document with Information of users such as name, address, etc {name: xxx, address: xxx}
    //Email: email used for registration.
    //Virtual Concurrency: the “money” users will be using for trading on the platform
    //Purchase History: sub-document with record of purchasing of the user.
    async addUser(userInfo, email) {

        if (!userInfo.name) throw "you must provide a name"
        if (!userInfo.address) throw "you must provide a address"
        if (!email) throw "you must provise a email"

        const userCollection = await users()
        //do we need to store the password here
        let newUser = {
            userInfo: userInfo,
            email: email,
            virtualConcurrency: 0.0,
            purchaseHistory: []
    }
        const insertInfo = await userCollection.insertOne(newUser)
        if (insertInfo.insertedCount === 0) throw "can not add user"
        const newId = insertInfo.insertedId
        const user = await this.getUserById(newId)
        return user
    },

}

module.exports = exportedMethod
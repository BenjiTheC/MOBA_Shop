const mongoCollections = require("./collections");
const users = mongoCollections.users;
const {ObjectId} = require('mongodb');
const dot = require('mongo-dot-notation')

const exportedMethod = {

    async getAllUsers(){
        const userCollection = await users();
        const allUser = await userCollection.find({}).toArray();
        return allUser;
    },

    async getUserById(id){
        //console.log(ObjectId.isValid(id))
        if (!id) throw "you must provide an id to search for"
        if (!ObjectId.isValid(id)) throw "invalid input id"
        const userCollection = await users();
        const user = await userCollection.findOne({_id: ObjectId(id)})
        if (user ===null) throw "no user with that id"
        return user
    },
    //what information must be provided ?
    //structure of User:
    //userID: unique ID for registered users
    //userName (string): The name set for user at account creation
    //userPassword (string): The password set for privacy
    //userInfo: a sub-document with Information of users such as name, address, etc {name: xxx, address: xxx}
    //Email: email used for registration.
    //Virtual Concurrency: the “money” users will be using for trading on the platform
    //Purchase History: sub-document with record of purchasing of the user.
    async addUser(userName, userPassword, userInfo, email) {

        if (!userName) throw "you must provide a userName"
        if (!userPassword) throw "you must provide a password"
        if (!userInfo.nickName) throw "you must provide a nick name"
        if (!userInfo.phone) throw "you must provide a phone number"
        if (!email) throw "you must provise a email"

        if (!userInfo.age) userInfo.age =  null
        if (!userInfo.hender) userInfo.gender = ""

        const userCollection = await users()

        let newUser = {
            userName: userName,
            userPassword: userPassword,
            userInfo: userInfo,
            email: email,
            virtualConcurrency: 0.0, // automatically assigned in the future
            purchaseHistory: []
        }
        const insertInfo = await userCollection.insertOne(newUser)
        if (insertInfo.insertedCount === 0) throw "can not add user"
        const newId = insertInfo.insertedId
        const user = await this.getUserById(newId)
        return user
    },

    async deleteUser(id) {
        if (!id) throw "you must provide an id to search for"
        if (!ObjectId.isValid(id)) throw "invalid input id"
        const userCollection = await users();
        const deletionInfo = await userCollection.removeOne({_id: ObjectId(id)})
        if (deletionInfo.deletedCount === 0) throw "Could not delete user with id of ${id}"
    },

    async updateUser(id, updateUser){
        if (!id) throw "you must provide an id to search for"
        if (!ObjectId.isValid(id)) throw "invalid input id"

        //add new info here
        if (!updateUser.userInfo.nickName && !updateUser.userInfo.phone && !updateUser.userInfo.age && !updateUser.userInfo.gender && !updateUser.email){
            throw "you must provide a nick name or phone or age or gender or email to be updated"
        }
        const userCollection = await users()

        let updateData = {}

        //add new info here
        if (updateUser.userInfo.nickName || updateUser.userInfo.phone || updateUser.userInfo.age|| updateUser.userInfo.gender) {
            updateData.userInfo = updateUser.userInfo
        }

        if (updateUser.email) updateData.email = updateUser.email

        //use dot.flatten to flatten the data in updateData for update a specific data in userInfo
        const updatedInfo = await userCollection.updateOne({_id: ObjectId(id)},dot.flatten(updateData))
        if (updatedInfo.modifiedCount === 0) throw "can not update user successfully"
        return await this.getUserById(ObjectId(id))

    }

}

module.exports = exportedMethod
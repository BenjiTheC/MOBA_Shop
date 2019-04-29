const mongoCollections = require("./collections");
const items = mongoCollections.items;
const users = require("./users");
const {ObjectId} = require('mongodb');
const dot = require('mongo-dot-notation');

const exportedMethod = {

    async searchByKeyword(keywordStr){
        if (!keywordStr) throw "you must provide a keyword string to search for"
        let keywordArr = keywordStr.split(" ")

        const allItems = await this.getAllItems();

        let itemMatched = []
        const arrLength = allItems.length
        for (let i = 0;i < arrLength; i ++){
            let itemName = allItems[i].information.name
            for (let j = 0; j < keywordArr.length; j++){
                if (itemName.toLowerCase().includes(keywordArr[j].toLowerCase())) {
                    itemMatched.push(allItems[i])
                    break;
                }
            } 
        }
        //console.log(itemMatched)
        return await this.addOwnerInfoToItem(itemMatched);

    },

    async addOwnerInfoToItem(itemArr){
        const arrLength = itemArr.length;
        const output = []
        for (let i = 0; i < arrLength; i ++){
            let currentInfo = itemArr[i]
            const owner = await users.getUserById(currentInfo.ownerId)
            const itemWithOwner = {
                _id: currentInfo._id,
                ownerInfo: {
                    ownerId: currentInfo.ownerId,
                    ownerName: owner.userInfo.nickName,
                    phone: owner.userInfo.phone,
                    email: owner.email
                    //add more user info here
                },
                itemInfo: currentInfo.information,
                tag: currentInfo.tag
            }
            output.push(itemWithOwner)
        }
        return output;
    },

    async getAllItems(){

        //need to implement return item information with author
        const itemCollection = await items();
        const allItems = await itemCollection.find({}).toArray();
        return allItems;
    },

    async getItemById(id){
        if (!id) throw "you must provide an id to search for"
        if (!ObjectId.isValid(id)) throw "invalid input id"
        const itemCollection = await items();
        const item = await itemCollection.findOne({_id: ObjectId(id)})
        if (item === null) throw "no item with that id"
        return item
    },

    async addItem(ownerId, information, tag) {
        if (!ownerId || !ObjectId.isValid(ownerId)) throw "you must provide a valid owner id"
        if (!information.name) throw "you must provide a name"
        if (!information.description) throw "you must provide a description"
        if (!information.image) throw "you must provide a url for image"
        if (!information.price) throw "you must provide a url for image"
        if (!information.amount) throw "you must provide a url for image"
        if (!tag) throw "you must provide a tag"
        const itemCollection = await items()
        let newItem = {
            ownerId: ownerId,
            information: information,
            tag: tag
        }
        const insertInfo = await itemCollection.insertOne(newItem)
        if (insertInfo.insertedCount === 0) throw "can not add item"
        const newId = insertInfo.insertedId
        const item = await this.getItemById(newId)
        return item
    }
    
}

module.exports = exportedMethod
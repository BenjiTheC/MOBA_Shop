const mongoCollections = require("./collections");
const items = mongoCollections.items;
const {ObjectId} = require('mongodb');
const dot = require('mongo-dot-notation');

const exportedMethod = {

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

    async addItem(ownerId, amount, information) {
        if (!ownerId || !ObjectId.isValid(ownerId)) throw "you must provide a valid owner id"
        if (!amount) throw "you must provide an amount"
        if (!information.description) throw "you must provide a description"
        if (!information.image) throw "you must provide a url for image"
        const itemCollection = await items()
        let newItem = {
            ownerId: ownerId,
            amount: amount,
            information: information,
            isPurchased: false
        }
        const insertInfo = await itemCollection.insertOne(newItem)
        if (insertInfo.insertedCount === 0) throw "can not add item"
        const newId = insertInfo.insertedId
        const item = await this.getItemById(newId)
        return item
    }
    
}

module.exports = exportedMethod
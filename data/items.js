const mongoCollections = require("./collections");
const items = mongoCollections.items;
const users = require("./users");
const {ObjectId} = require('mongodb');
const dot = require('mongo-dot-notation');

const exportedMethod = {

    async getItemsByTag(tag){

        const itemCollection = await items();
        const matchedItems = await itemCollection.find({isPurchase: false, tag: tag}).toArray();
        for (let i = 0; i < matchedItems.length; i ++){
            const itemInfo = {
                itemPic: matchedItems[i].information.image,
                itemName: matchedItems[i].information.name,
                itemPrice: matchedItems[i].information.price,
                itemId: matchedItems[i]._id
            }
            matchedItems[i] = itemInfo;
        }
        return matchedItems;

    },

    async getNewestItemForMain(num){

        const allItems = await this.getAllItems();
        if (allItems.length >= num){

            startIndex = allItems.length - num;
            for (let i = startIndex; i < allItems.length; i ++){
                const itemInfo = {
                    itemPic: allItems[i].information.image,
                    itemName: allItems[i].information.name,
                    itemPrice: allItems[i].information.price,
                    itemId: allItems[i]._id
                }
                allItems[i] = itemInfo;
            }
            return allItems;
            // return {length: num, items:allItems};
        }else {
            for (let i = 0; i < allItems.length; i ++){
                const itemInfo = {
                    itemPic: allItems[i].information.image,
                    itemName: allItems[i].information.name,
                    itemPrice: allItems[i].information.price,
                    itemId: allItems[i]._id
                }
                allItems[i] = itemInfo;
            }
            return allItems;
            // return {length: allItems.length, items:allItems};
        }


    },

    // itemPic: "https://via.placeholder.com/300x300.png?text=Item+Picture",
    // itemName: undefined,
    // itemPrice: 100000,
    // itemId: undefined

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
                    const itemInfo = {
                        itemId: allItems[i]._id,
                        itemName: allItems[i].information.name,
                        itemPrice: allItems[i].information.price,
                        itemPic: allItems[i].information.image
                    }
                    itemMatched.push(itemInfo);
                    break;
                }
            } 
        }
        //console.log(itemMatched)
        return itemMatched;

    },

    async addOwnerInfoToItem(itemArr){
        const arrLength = itemArr.length;
        const output = []
        for (let i = 0; i < arrLength; i ++){
            let currentInfo = itemArr[i]
            const owner = await users.getUserById(currentInfo.ownerId)
            const itemWithOwner = {
                _id: currentInfo._id,

                ownerId: currentInfo.ownerId,
                ownerName: owner.userInfo.nickName,
                phone: owner.userInfo.phone,
                email: owner.email,
                //add more user info here

                itemName: currentInfo.information.name,
                description: currentInfo.information.description,
                image: currentInfo.information.image,
                price: currentInfo.information.price,
                amount: currentInfo.information.amount,
                tag: currentInfo.tag
            }
            output.push(itemWithOwner)
        }
        return output;
    },

    async getAllItems(){

        //need to implement return item information with author
        const itemCollection = await items();
        const allItems = await itemCollection.find({isPurchase: false}).toArray();
        return allItems;
    },

    async getItemById(id){
        if (!id) throw "you must provide an id to search for"
        if (!ObjectId.isValid(id)) throw "invalid input id"
        const itemCollection = await items();
        const item = await itemCollection.findOne({_id: ObjectId(id)})
        if (item === null) throw "no item with that id"
        const temp = []
        temp.push(item)
        const process = await this.addOwnerInfoToItem(temp)
        return process[0]
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
            tag: tag,
            isPurchase: false,
            buyerId:""

        }
        const insertInfo = await itemCollection.insertOne(newItem)
        if (insertInfo.insertedCount === 0) throw "can not add item"
        const newId = insertInfo.insertedId
        const item = await this.getItemById(newId)
        return item
    },

    async updateItemPurchaseStatus(itemId, status) {
        if (typeof status != 'boolean') {
            throw 'status should be Boolean'
        }
        
        let data = {
            isPurchased: status
        }
        const itemCollection = await items();
        return await itemCollection.updateOne({ _id: ObjectId(itemId) }, dot.flatten(data))
    }
    
}

module.exports = exportedMethod
const mongoCollections = require("./collections");
const items = mongoCollections.items;
const users = require("./users");
const conversation = require("./conversation");
const { ObjectId } = require("mongodb");
const dot = require("mongo-dot-notation");

const exportedMethod = {
  async getItemsByTag(tag) {
    let itemList = [];
    const itemCollection = await items();
    const matchedItems = await itemCollection
      .find({ isPurchase: false, tag: tag })
      .toArray();
    for (let i = 0; i < matchedItems.length; i++) {
      const itemInfo = {
        itemPic: matchedItems[i].information.image,
        itemName: matchedItems[i].information.name,
        itemPrice: matchedItems[i].information.price,
        itemId: matchedItems[i]._id,
        ownerId: matchedItems[i].ownerId
      };
      itemList.push(itemInfo);
    }
    return itemList;
  },

  async getItemsByOwner(ownerId) {
    let itemList = [];
    const itemCollection = await items();
    const matchedItems = await itemCollection
      .find({ isPurchase: false, ownerId: ObjectId(ownerId) })
      .toArray();
    for (let i = 0; i < matchedItems.length; i++) {
      const itemInfo = {
        itemPic: matchedItems[i].information.image,
        itemName: matchedItems[i].information.name,
        itemPrice: matchedItems[i].information.price,
        itemId: matchedItems[i]._id,
        ownerId: matchedItems[i].ownerId
      };
      itemList.push(itemInfo);
    }
    return itemList;
  },

  async getNewestItemForMain(num) {
    const allItems = await this.getAllItems();
    let itemLst = [];

    const startIndex = allItems.length
      ? allItems.length - num
      : allItems.length;

    for (let i = startIndex; i < allItems.length; i++) {
      let tempItem = allItems[i];
      const itemInfo = {
        itemPic: tempItem.information.image,
        itemName: tempItem.information.name,
        itemPrice: tempItem.information.price,
        itemId: tempItem._id,
        ownerId: tempItem.ownerId
      };
      itemLst.push(itemInfo);
    }
    return itemLst;
  },

  // itemPic: "https://via.placeholder.com/300x300.png?text=Item+Picture",
  // itemName: undefined,
  // itemPrice: 100000,
  // itemId: undefined

  async searchByKeyword(keywordStr) {
    if (!keywordStr) throw "you must provide a keyword string to search for";
    let keywordArr = keywordStr.split(" ");

    const allItems = await this.getAllItems();

    let itemMatched = [];
    const arrLength = allItems.length;
    for (let i = 0; i < arrLength; i++) {
      let tempItem = allItems[i];
      let itemName = tempItem.information.name;
      for (let j = 0; j < keywordArr.length; j++) {
        if (itemName.toLowerCase().includes(keywordArr[j].toLowerCase())) {
          const itemInfo = {
            itemPic: tempItem.information.image,
            itemName: tempItem.information.name,
            itemPrice: tempItem.information.price,
            itemId: tempItem._id,
            ownerId: tempItem.ownerId
          };
          itemMatched.push(itemInfo);
          break;
        }
      }
    }
    //console.log(itemMatched)
    return itemMatched;
  },

  async addOwnerInfoToItem(itemArr) {
    const arrLength = itemArr.length;
    const output = [];
    for (let i = 0; i < arrLength; i++) {
      let currentInfo = itemArr[i];
      const owner = await users.getUserById(currentInfo.ownerId);
      const itemWithOwner = {
        _id: currentInfo._id,

        ownerId: currentInfo.ownerId,
        ownerName: owner.username,
        phone: owner.phone,
        email: owner.email,
        //add more user info here

        itemName: currentInfo.information.name,
        description: currentInfo.information.description,
        image: currentInfo.information.image,
        price: currentInfo.information.price,
        tag: currentInfo.tag
      };
      output.push(itemWithOwner);
    }
    return output;
  },

  async getAllItems() {
    //need to implement return item information with author
    const itemCollection = await items();
    const allItems = await itemCollection.find({ isPurchase: false }).toArray();
    return allItems;
  },
  //this function only return the item info.
  async getItemById(id) {
    if (!id) throw "you must provide an id to search for";
    if (!ObjectId.isValid(id)) throw "invalid input id";

    const itemCollection = await items();
    const item = await itemCollection.findOne({ _id: ObjectId(id) });

    if (item === null) throw "no item with that id";

    const itemInfo = {
      _id: item._id,
      ownerId: item.ownerId,
      itemName: item.information.name,
      description: item.information.description,
      image: item.information.image,
      price: item.information.price,
      tag: item.tag
    };
    return itemInfo;
  },

  async getItemWithOwnerAndCon(id) {
    if (!id) throw "you must provide an id to search for";
    if (!ObjectId.isValid(id)) throw "invalid input id";
    const itemCollection = await items();
    const item = await itemCollection.findOne({ _id: ObjectId(id) });
    const conArr = await conversation.getConByItemId(id);
    if (item === null) throw "no item with that id";
    const temp = [];
    temp.push(item);
    const process = await this.addOwnerInfoToItem(temp);
    let itemDetail = process[0];
    itemDetail.conversation = conArr;
    return itemDetail;
  },

  async addItem(ownerId, information, tag) {
    if (!ownerId || !ObjectId.isValid(ownerId))
      throw "you must provide a valid owner id";
    if (!information.name) throw "you must provide a name";
    if (!information.description) throw "you must provide a description";
    if (!information.image) throw "you must provide a url for image";
    if (!information.price) throw "you must provide a price";
    if (!tag) throw "you must provide a tag";
    const itemCollection = await items();
    let newItem = {
      ownerId: ownerId,
      information: information,
      tag: tag,
      isPurchase: false,
      buyerId: ""
    };
    const insertInfo = await itemCollection.insertOne(newItem);
    if (insertInfo.insertedCount === 0) throw "can not add item";
    const newId = insertInfo.insertedId;
    const item = await this.getItemById(newId);
    return item;
  },

  async updateItemPurchaseStatus(itemId, status) {
    if (typeof status != "boolean") {
      throw "status should be Boolean";
    }

    let data = {
      isPurchase: status
    };
    const itemCollection = await items();
    return await itemCollection.updateOne(
      { _id: ObjectId(itemId) },
      dot.flatten(data)
    );
  }
};

module.exports = exportedMethod;

const mongoCollections = require("./collections");
const conversation = mongoCollections.conversation;
const { ObjectId } = require("mongodb");
const dot = require("mongo-dot-notation");

const exportedMethod = {

    async getConByItemId(itemId){
        if (!itemId) throw "you must provide an id to search for";
        if (!ObjectId.isValid(itemId)) throw "invalid input id";
        const conCollection = await conversation();
        const conversations = await conCollection.find({itemId: itemId}).toArray();
        return conversations;
    },

    async getConById(id) {
        if (!id) throw "you must provide an id to search for";
        if (!ObjectId.isValid(id)) throw "invalid input id";
        const conCollection = await conversation();
        const con = await conCollection.findOne({ _id: ObjectId(id) });
        if (con === null) throw "no conversation with that id";
        return con;
    },
    //add reply by a put route
    async addReply(conId, comment, posterId){
        if (!conId || !ObjectId.isValid(conId)) throw "you must provide a valid id";
        if (!posterId || !typeof posterId === "string") throw "you must provide a poster id";
        if (!comment || !typeof comment === "string") throw "you must provide a comment";
        const replyCon = await this.getConById(conId);
        let replyArr = replyCon.replyArray;
        const replyComment = {
            posterId: posterId,
            comment: comment
        }
        replyArr.push(replyComment);
        let updateData = {
            replyArray: replyArr
        }
        const conCollection = await conversation();
        const updatedInfo = await conCollection.updateOne({_id: ObjectId(conId)},dot.flatten(updateData));
        if (updatedInfo.modifiedCount === 0) throw "can not add reply successful";
        return this.getConById(conId);

    },
    //add conversation by a post route
    async addCon(itemId, posterId, comment){
        
        if (!itemId || !ObjectId.isValid(itemId)) throw "you must provide a valid id";
        if (!posterId || typeof posterId !== "string") throw "you must provide a poster id";
        if (!comment || typeof comment !== "string") throw "you must provide a comment";

        let newCon = {
            itemId: itemId,
            posterId: posterId,
            comment: comment,
            replyArray: []//store all the reply of this comment, which form the conversation.
        }
        const conCollection = await conversation();
        const insertInfo = await conCollection.insertOne(newCon);
        if (insertInfo.insertedCount === 0) throw "can not add conversation";
        const newId = insertInfo.insertedId;
        const con = await this.getConById(newId);
        return con;
        
    }

}

module.exports = exportedMethod;
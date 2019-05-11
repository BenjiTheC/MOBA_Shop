const express = require("express");
const router = express.Router();
const data = require("../data");
const conData = data.conversation;

//next step: find user name by user id and return!

//dont't need get route here because the information will be shown in the get item routes
//this post route will post a new comment
//post /conversation?itemId=asdasd&posterId=111111
// need to check all the id are valid
router.post("/", async (req, res) => {
    console.log("in post conversation route")
    console.log(req.query.itemId)
    console.log(req.query.posterId)
    const newcomment = req.body;

    const itemId = req.query.itemId;
    const posterId = req.query.posterId;
    const comment = newcomment.comment;

    const newCon = await conData.addCon(itemId,posterId,comment);

    res.json(newCon);

});

//this put route will add a reply to a existed route by add a comment into the replyArray
//put /conversation?conId=5cd5e21a5b790335a449dd9a&posterId=5cd4edf21678de34c00b4c5e
// need to check all the id are valid
router.put("/", async (req, res) => {
    console.log("in add reply route")
    console.log(req.query.conId);
    console.log(req.query.posterId);
    const newReply = req.body;

    if (!newReply.comment || typeof newReply.comment !== "string") throw "invalid input comment"

    const conId = req.query.conId;
    const posterId = req.query.posterId;
    const comment = newReply.comment;
    try {
        const updatedCon = await conData.addReply(conId, comment, posterId);
        res.json(updatedCon);
    }catch (e) {
        console.log(e)
    }



});

module.exports = router;
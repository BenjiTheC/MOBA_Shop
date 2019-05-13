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
  console.log("in POST /conversation route");
  console.log(req.body);

  const { itemId, posterId, comment } = req.body;

  const newCon = await conData.addCon(itemId, posterId, comment);

  return res.redirect(`/items/${itemId}`);
});

//this put route will add a reply to a existed route by add a comment into the replyArray
//put /conversation?conId=5cd5e21a5b790335a449dd9a&posterId=5cd4edf21678de34c00b4c5e
// need to check all the id are valid
router.put("/", async (req, res) => {
  console.log("in add reply route");

  const { conId, posterId, comment } = req.body;
  try {
    const updatedCon = await conData.addReply(conId, comment, posterId);
    if (updatedCon) return res.json({ conId, comment });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;

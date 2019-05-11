const express = require("express");
const { isLoggedIn } = require("../middlewares");
const router = express.Router();
const data = require("../data");
const itemData = data.items;

router.get("/", async (req, res) => {
  const num = 30; //nubmer of items display in the home page can be changed here
  const itemList = await itemData.getNewestItemForMain(num);

  return res.render("template/home", {
    title: "MOBA Shop",
    itemList: itemList,
    isLoggedIn: isLoggedIn(req, res),
    userInfo: req.session.user
  });
});

module.exports = router;

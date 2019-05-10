const express = require("express");
const { isLoggedIn } = require("../middlewares");
const router = express.Router();
const data = require("../data");
const itemData = data.items;

router.get("/", async (req, res) => {
  // const itemList = itemGenerator(11);

  // get itemInfo from database!!!!!!
  const num = 30; //can be turn here
  const itemList = await itemData.getNewestItemForMain(num);
  console.log(req.session.user);

  return res.render("template/home", {
    title: "MOBA Shop",
    itemList: itemList,
    isLoggedIn: isLoggedIn(req, res),
    userInfo: req.session.user
  });
});

module.exports = router;

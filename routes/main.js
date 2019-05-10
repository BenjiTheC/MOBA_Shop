const express = require("express");
const { isLoggedIn } = require("../middlewares");
const router = express.Router();
const data = require("../data");
const itemData = data.items;

const MOCK_USER_BENJI = {
  userId: "userbenji_00001",
  userPic: "https://via.placeholder.com/512x512.png?text=User+Picture",
  userName: "Benji",
  userAsset: 65536
};

router.get("/", async (req, res) => {
  // const itemList = itemGenerator(11);

  // get itemInfo from database!!!!!!
  const num = 30; //can be turn here
  const itemList = await itemData.getNewestItemForMain(num);

  return res.render("template/home", {
    title: "MOBA Shop",
    itemList: itemList,
    isLoggedIn: isLoggedIn(req, res),
    userInfo: MOCK_USER_BENJI
  });
});

module.exports = router;

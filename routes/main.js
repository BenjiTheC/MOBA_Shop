const express = require("express");
const router = express.Router();
const data = require("../data");
const itemData = data.items;

router.get("/", async (req, res) => {
  console.log("in GET /");
  if (!req.session.cart) req.session.cart = []; // initiate the cart, just in case
  const num = 30; //nubmer of items display in the home page can be changed here
  const itemList = await itemData.getNewestItemForMain(num);

  return res.render("home", {
    title: "MOBA Shop",
    itemList: itemList,
    userInfo: req.session.user,
    itemInCart: req.session.cart.length
  });
});

module.exports = router;

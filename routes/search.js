// after the user get enter the key words, what to response
const express = require("express");
const router = express.Router();
const data = require("../data");
const itemData = data.items;

router.get("/", async (req, res) => {
  console.log("in GET /search");
  if (!req.query.searchKeyword)
    return res
      .status(400)
      .render("error", { error: { status: 400, msg: "no serachKeyword!" } });

  try {
    let isMatched = false;
    const matchedItem = await itemData.searchByKeyword(req.query.searchKeyword);
    if (matchedItem.length > 0) isMatched = true;
    return res.render("search", {
      isMatched: isMatched,
      searchResult: matchedItem,
      userInfo: req.session.user,
      itemInCart: req.session.cart.length
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;

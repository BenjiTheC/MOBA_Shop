const express = require("express");
const router = express.Router();
const data = require("../data");
const itemData = data.items;
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  }
});

const upload = multer({ storage: storage });
//can add limit for image here

router.get("/", async (req, res) => {
  console.log("in GET /items");
  try {
    const itemList = await itemData.getAllItems();
    //to be implemented
    //...
    //res.render()

    res.json(itemList);
  } catch (e) {
    res.sendStatus(500);
    return;
  }
});

router.get("/:id", async (req, res) => {
  console.log(`in GET /items/${req.params.id}`);
  try {
    const item = await itemData.getItemWithOwnerAndCon(req.params.id);

    res.render("template/itemDetail", {
      item: item,
      userInfo: req.session.user,
      itemInCart: req.session.cart.length
    });
  } catch (e) {
    res.status(500).json({
      error: { status: 500, msg: "Something goes wrong in our end..." }
    });
    return;
  }
});

router.post("/", upload.single("itemImage"), async (req, res) => {
  console.log("in POST /item");
  //console.log(req.file)
  //console.log(req.body)
  const newItemInfo = req.body;

  if (!newItemInfo.ownerId) {
    res
      .status(400)
      .json({ error: "You must provide the owner id to add a item" });
    return;
  }
  if (!newItemInfo.name) {
    res.status(400).json({ error: "You must provide a name to add a item" });
    return;
  }
  if (!newItemInfo.description) {
    res
      .status(400)
      .json({ error: "You must provide the description to add a item" });
    return;
  }
  if (!newItemInfo.price) {
    res.status(400).json({ error: "You must provide the price to add a item" });
    return;
  }
  if (!newItemInfo.amount) {
    res
      .status(400)
      .json({ error: "You must provide the amount to add a item" });
    return;
  }
  if (!newItemInfo.tag) {
    res.status(400).json({ error: "You must provide a tag to add a item" });
    return;
  }
  newItemInfo.information = {
    name: newItemInfo.name,
    description: newItemInfo.description,
    image: req.file.path.replace(/\\/g, "/"), //get path here
    price: newItemInfo.price,
    amount: newItemInfo.amount
  };

  try {
    const newItem = await itemData.addItem(
      newItemInfo.ownerId,
      newItemInfo.information,
      newItemInfo.tag
    );
    //to be implemented
    //...
    //res.render()
    res.json(newItem);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
    console.log(e);
    return;
  }
});

router.get("/tag/:tag", async (req, res) => {
  console.log(`in GET /tag/${req.params.tag}`);

  let matchedItems;
  try {
    matchedItems = await itemData.getItemsByTag(req.params.tag);
    console.log(`got ${matchedItems.length} items`);
  } catch (e) {
    console.log(e);
  }

  return res.status(200).json(matchedItems);
});

module.exports = router;

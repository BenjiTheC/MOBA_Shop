const express = require("express");
const router = express.Router();
const data = require("../data");
const itemData = data.items;
const { isAuthenticated } = require("../middlewares");
const xss = require("xss");

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

router.get("/", isAuthenticated, async (req, res) => {
  console.log("in GET /items");
  try {
    return res.render("sellItem", {
      userInfo: req.session.user,
      itemInCart: req.session.cart.length
    });
  } catch (e) {
    res.sendStatus(500);
    return;
  }
});

router.post(
  "/",
  isAuthenticated,
  upload.single("itemimage"),
  async (req, res) => {
    console.log("in POST /item");
    //const itemInfo = req.body;
      const itemInfo = {
          name: xss(req.body.name),
          description: xss(req.body.description),
          price: xss(req.body.price),
          amount: xss(req.body.amount),
          tag: xss(req.body.tag)
      }
    console.log(itemInfo);
    console.log(req.file.path);

    const ownerId = req.session.user.userId; // middleware iiAuthenticated make sure we can get access of the user in the route
    const tag = itemInfo.tag;
    delete itemInfo.tag;
    console.log(tag);
    itemInfo.image = req.file.path.replace(/\\/g, "/"); // get the path

    try {
      const newItem = await itemData.addItem(ownerId, itemInfo, tag);
      return res.render("sellItemSuccess", {
        userInfo: req.session.user,
        itemInCart: req.session.cart.length,
        item: newItem
      });
    } catch (e) {
      console.log(e);
      res.status(500).render("errer", {
        error: { status: 500, msg: "Somthing goes worng in our end..." }
      });
      console.log(e);
      return;
    }
  }
);

router.get("/:id", async (req, res) => {
  console.log(`in GET /items/${req.params.id}`);
  try {
    const item = await itemData.getItemWithOwnerAndCon(req.params.id);
    console.log(item);
    res.render("itemDetail", {
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

router.get("/tag/:tag", async (req, res) => {
  console.log(`in GET /tag/${req.params.tag}`);

  let matchedItems;
  try {
    matchedItems = await itemData.getItemsByTag(req.params.tag);
    console.log(`got ${matchedItems.length} items`);
  } catch (e) {
    console.log(e);
    return res.status(500).render("error", {
      error: { status: 500, msg: "Something goes wrong in our end..." }
    });
  }

  return res.render("showByTag", {
    matchedItems: matchedItems,
    userInfo: req.session.user,
    itemInCart: req.session.cart.length
  });
});

module.exports = router;

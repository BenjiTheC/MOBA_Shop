const express = require("express");
const router = express.Router({ mergeParams: true });
const data = require("../data");
const userData = data.users;
const itemData = data.items;
const { isAuthenticated } = require("../middlewares");

const getItemObjOfCart = async cart => {
  const itemsObjInCart = [];
  for (let itemId of cart) {
    let itemObj;
    try {
      itemObj = await itemData.getItemById(itemId);
      // console.log(itemObj);
    } catch (e) {
      console.log(e);
    }
    itemsObjInCart.push(itemObj);
  }
  return itemsObjInCart;
};

router.post("/", async (req, res) => {
  console.log("in POST /cart");
  // this route will be hitted by ajax
  if (!req.session.cart) req.session.cart = []; // make a new cart if there is not cart/cart empty

  const cart = req.session.cart;
  const ids = req.body;

  if (!cart.includes(ids.itemId)) cart.push(ids.itemId);

  return res.json({ itemInCart: cart.length });
});

router.get("/", async (req, res) => {
  console.log("in GET /cart");
  if (!req.session.cart) req.session.cart = []; // make a new cart if there is not cart/cart empty

  const cart = req.session.cart;

  const itemsObjInCart = await getItemObjOfCart(cart);
  console.log(itemsObjInCart);
  return res.render("cartDetail", {
    userInfo: req.session.user,
    itemInCart: req.session.cart.length,
    itemsObjInCart: itemsObjInCart
  });
});

router.delete("/:itemId", async (req, res) => {
  console.log("in DELETE /item");
  let itemId = req.params.itemId;
  let uid = req.params.uid;

  if (!itemId) {
    return res.status(400).send("invalid item Id");
  }

  await userData.deleteUserCartItem(uid, itemId);
  return res.send(await userData.getUserCartItems(uid));
});

router.get("/purchase", isAuthenticated, async (req, res) => {
  console.log("in GET /cart/purchase");

  const user = req.session.user,
    cart = req.session.cart;
  let itemsObjInCart = await getItemObjOfCart(cart);
  const originalLen = itemsObjInCart.length;

  itemsObjInCart = itemsObjInCart.filter(item => {
    return item.ownerId != user.userId; // didn't use !== because ownerId is object and userId is string. Only compare the value
  });
  const calculateLen = itemsObjInCart.length;

  let totalPrice = 0;
  itemsObjInCart.forEach(item => {
    totalPrice += item.price;
  });

  return res.render("cartConfirm", {
    userInfo: req.session.user,
    itemInCart: req.session.cart.length,
    itemsObjInCart: itemsObjInCart,
    lengthDiff: originalLen - calculateLen,
    totalPrice: totalPrice
  });
});

router.post("/purchase", isAuthenticated, async (req, res) => {
  console.log("in POST /purchase"); // this route will be hitted by ajax
  const updateObj = {}; // update data pass into the data module
  const total = parseInt(req.body.total);
  const user = req.session.user;
  const cart = req.session.cart;
  const itemsObjInCart = await getItemObjOfCart(cart); //not necessary an array of objects, can be optimized

  user.userAsset -= total;

  updateObj.virtualConcurrency = user.userAsset;
  updateObj.purchaseHistory = itemsObjInCart
    .filter(item => {
      return item.ownerId != user.userId;
    })
    .map(item => {
      return item._id;
    }); // filter out the item belong to current logged in user, get the id of remaining

  let updatedUser;
  try {
    // update the user's asset and purchase history
    updatedUser = await userData.purchaseUpdate(user.userId, updateObj);
  } catch (e) {
    console.log(e);
  }

  updateObj.purchaseHistory.forEach(async itemId => {
    await itemData.updateItemPurchaseStatus(itemId, true);
  });

  req.session.cart = []; // empty the cart after purchase

  return res.json({
    itemInCart: req.session.cart.length,
    userAsset: user.userAsset
  });
});

module.exports = router;

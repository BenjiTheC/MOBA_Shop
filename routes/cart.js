const express = require("express");
const router = express.Router({ mergeParams: true });
const data = require("../data");
const userData = data.users;
const itemData = data.items;

router.post("/", async (req, res) => {
  // this route will be hitted by ajax
  if (!req.session.cart) req.session.cart = []; // make a new cart if there is not cart/cart empty

  const cart = req.session.cart;
  const itemId = req.body;

  console.log(itemId.itemId);
  console.log(cart.includes(itemId.itemId));
  if (!cart.includes(itemId.itemId)) cart.push(itemId.itemId);

  return res.json({ itemInCart: cart.length });
});

router.get("/", (req, res) => {
  res.send("test");
});

router.put("/", (req, res) => {});

router.delete("/:itemId", async (req, res) => {
  let itemId = req.params.itemId;
  let uid = req.params.uid;

  if (!itemId) {
    return res.status(400).send("invalid item Id");
  }

  await userData.deleteUserCartItem(uid, itemId);
  return res.send(await userData.getUserCartItems(uid));
});

router.post("/:itemId/purchase", async (req, res) => {
  let itemId = req.params.itemId;
  let uid = req.params.uid;
  let item = await itemData.getItemById(itemId);

  if (item.isPurchased == true) {
    return res.status(400).send("The item has been purchased");
  }
  let user = await userData.getUserById(uid);

  if (
    parseInt(user.virtualConcurrency) <= 0 ||
    parseInt(user.virtualConcurrency) < parseInt(item.amount)
  ) {
    return res.status(400).send("You don't have enough money!!!");
  }

  // charge user's money
  await userData.updateVirtualConcurrency(
    uid,
    user.virtualConcurrency - item.amount
  );

  // set purchase status to be true
  await itemData.updateItemPurchaseStatus(itemId, true);

  // add to history
  await userData.addPurhcaseHistory(uid, itemId);

  return res.send(await userData.getUserById(uid));
});

module.exports = router;

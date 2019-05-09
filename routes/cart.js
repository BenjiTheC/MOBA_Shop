const express = require("express");
const router = express.Router({ mergeParams: true });
const data = require("../data");
const userData = data.users;
const itemData = data.items;

router.post("/", async (req, res) => {
  let data = req.body;
  let uid = req.params.uid;
  console.log(req.params);
  console.log(req.body);
  return res.status(200).json({ message: `BLBLBLBL` });
  if (!Array.isArray(data)) {
    res.status(400).send("Not an array");
    return;
  }

  // Get and merge cart data
  let user = await userData.getUserById(uid);
  let dataSet = new Set(data.concat(user.cart));

  // Insert data into cart
  let result = await userData.updateUserCart(uid, Array.from(dataSet));
  res.send(result);
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

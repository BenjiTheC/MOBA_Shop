const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const itemData = data.items;
const xss = require("xss");

router.get("/:id", async (req, res) => {
  try {
    console.log(`in GET /users/${req.params.id}`);
    const userId = req.params.id;

    const user = await userData.getUserById(userId);
    const userInfo = {
      userId: user._id,
      userName: user.username,
      userAsset: user.virtualConcurrency
    };

    const purchaseHistory = [];
    user.purchaseHistory.forEach(async itemId => {
      purchaseHistory.push(await itemData.getItemById(itemId));
    });

    const currentSelling = await itemData.getItemsByOwner(userId);
    // console.log(purchaseHistory);
    // console.log(currentSelling);

    return res.render("userDashboard", {
      purchaseHistory: purchaseHistory,
      currentSelling: currentSelling,
      userInfo: userInfo,
      itemInCart: req.session.cart.length
    });
  } catch (e) {
    return res.status(500).render("error", {
      error: {
        status: 500,
        msg: "Seems like something goes wrong when retrieving the user..."
      }
    });
  }
});

// router.put("/:id", async (req, res) => {
//   const inputInfo = req.body;
//
//   if (!inputInfo) {
//     res.status(400).json({ error: "You must provide data to update a user" });
//     return;
//   }
//   if (
//     !inputInfo.userInfo.nickName &&
//     !inputInfo.userInfo.phone &&
//     !inputInfo.userInfo.age &&
//     !inputInfo.userInfo.gender &&
//     !inputInfo.email
//   ) {
//     res.status(400).json({
//       error: "you must provide a name or address or email to be updated"
//     });
//     return;
//   }
//   try {
//     await userData.getUserById(req.params.id);
//   } catch (e) {
//     res.status(404).json({ error: "User not found" });
//     return;
//   }
//   try {
//     const updatedUser = await userData.updateUser(req.params.id, inputInfo);
//     //to be implemented
//
//     res.json(updatedUser);
//   } catch (e) {
//     res.sendStatus(500);
//   }
// });

// router.delete("/:id", async (req, res) => {
//   try {
//     await userData.getUserById(req.params.id);
//   } catch (e) {
//     res.status(404).json({ error: "User not found" });
//   }
//   try {
//     const user = await userData.getUserById(req.params.id);
//     //to be implemented
//     await userData.deleteUser(req.params.id);
//     res.json({ deleted: true, data: user });
//     return;
//   } catch (e) {
//     res.sendStatus(500);
//     return;
//   }
// });

module.exports = router;

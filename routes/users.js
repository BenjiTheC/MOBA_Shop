const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const itemData = data.items;

// router.get("/", async (req, res) => {
//   try {
//     const userList = await userData.getAllUsers();
//     //to be implemented
//     //...
//     //res.render()

//     res.json(userList);
//   } catch (e) {
//     res.sendStatus(500);
//     return;
//   }
// });

router.get("/:id", async (req, res) => {
  try {
    console.log(`in GET /users/${req.params.id}`);
    const userId = req.params.id;

    const user = await userData.getUserById(userId);
    const renderUser = {
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

    return res.render("template/userdashboard", {
      purchaseHistory: purchaseHistory,
      currentSelling: currentSelling,
      isLoggedIn: true, //quick dirty hack
      userInfo: renderUser,
      itemInCart: req.session.cart.length
    });
  } catch (e) {
    return res.status(500).render("template/error", {
      error: {
        status: 500,
        msg: "Seems like something goes wrong when retrieving the user..."
      }
    });
  }
});

router.get("/:id/cart", async (req, res) => {
  console.log(`in GET /${req.params.id}/cart`);

  res.render("template/usercart", {});
});

router.put("/:id", async (req, res) => {
  const inputInfo = req.body;

  if (!inputInfo) {
    res.status(400).json({ error: "You must provide data to update a user" });
    return;
  }
  if (
    !inputInfo.userInfo.nickName &&
    !inputInfo.userInfo.phone &&
    !inputInfo.userInfo.age &&
    !inputInfo.userInfo.gender &&
    !inputInfo.email
  ) {
    res.status(400).json({
      error: "you must provide a name or address or email to be updated"
    });
    return;
  }
  try {
    await userData.getUserById(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  try {
    const updatedUser = await userData.updateUser(req.params.id, inputInfo);
    //to be implemented

    res.json(updatedUser);
  } catch (e) {
    res.sendStatus(500);
  }
});
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

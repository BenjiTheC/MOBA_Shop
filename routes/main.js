const express = require('express');
const router = express.Router();

const MOCK_USER_BENJI = {
  userPic: "https://via.placeholder.com/512x512.png?text=User+Picture",
  userName: "Benji",
  userAsset: 65536,
}

function itemGenerator(repeat_time) {
  const itemSeed = {
      itemPic: "https://via.placeholder.com/300x300.png?text=Item+Picture",
      itemName: undefined,
      itemPrice: 100000,
    };

  const itemList = [];

  for (i = 0; i < repeat_time; i++) {
    const tempItem = Object.assign({}, itemSeed);
    tempItem.itemName = `Item No.${i}`;
    tempItem.itemPrice += i;
    itemList.push(tempItem);
  }

  return itemList
}

router.get('/', async (req, res) => {
  const itemList = itemGenerator(11);
  return res.render('template/home', { title: "MOBA Shop", itemList: itemList, isLoggedIn: false, userInfo: MOCK_USER_BENJI });
})

module.exports = router;
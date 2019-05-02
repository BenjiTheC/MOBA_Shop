// after the user get enter the key words, what to response
const express = require('express');
const router = express.Router();
const data = require("../data");
const itemData = data.items;

router.get('/', async (req, res) => {
  //console.log('in GET /search');
  if (!req.query.searchKeyword) return res.status(400).json({ status: 400, err: 'no serachKeyword!' });

  try{
      let isMatched = false
      const matchedItem = await itemData.searchByKeyword(req.query.searchKeyword)
      if (matchedItem.length > 0) isMatched = true
      //res.render()
      res.status(200).json({isMatched: isMatched, data: matchedItem})

  }catch (e) {
      console.log(e)
  }

  //res.status(200).json({ keyword: req.query.searchKeyword });
})

module.exports = router;
// after the user get enter the key words, what to response
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  console.log('in GET /search');
  if (!req.query.searchKeyword) return res.status(400).json({ status: 400, err: 'no serachKeyword!' });

  res.status(200).json({ keyword: req.query.searchKeyword });
})

module.exports = router;
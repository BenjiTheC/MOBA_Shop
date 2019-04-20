const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  return res.render('template/home', { title: "MOBA Shop" });
})

module.exports = router;
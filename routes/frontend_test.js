const express = require('express');
const router = express.Router();

router.get('/login', async (req, res) => {
  return res.render('template/login', {});
})

module.exports = router;
const express = require('express');
const router = express.Router();

router.get('/login', async (req, res) => {
  console.log('in GET /authen/login');

  res.status(200).json({ status: 200, msg: "hit the route successfully!", currentRoute: "GET /authen/login" });
})

router.get('/signup', async (req, res) => {
  console.log('in GET /authen/signup');

  res.status(200).json({ status: 200, msg: "hit the route successfully!", currentRoute: "GET /authen/signup" });
})

module.exports = router;
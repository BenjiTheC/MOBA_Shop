const express = require("express");
const router = express.Router();

router.get("/login", async (req, res) => {
  console.log("in GET /authen/login");

  return res.render("template/login", {});
});

router.post("/login", async (req, res) => {
  console.log("in POST /authen/login");
  console.log(req.body);

  return res.status(200).json({
    status: 200,
    msg: "successfully hit the route!",
    currentRoute: "POST /authen/login",
    body: req.body
  });
});

router.get("/signup", async (req, res) => {
  console.log("in GET /authen/signup");

  return res.render("template/signup", {});
});

router.post("/signup", async (req, res) => {
  console.log("in POST /authen/signup");
  console.log(req.body);

  return res.status(200).json({
    status: 200,
    msg: "successfully hit the route!",
    currentRoute: "POST /authen/signup",
    body: req.body
  });
});

router.get("/logout", async (req, res) => {
  console.log("in GET /authen/logout");
  console.log(req.session);

  return res.status(200).json({
    status: 200,
    msg: "successfully hit the route!",
    currentRoute: "POST /authen/logout"
  });
});

module.exports = router;

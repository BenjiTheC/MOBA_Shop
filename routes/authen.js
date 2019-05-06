const express = require("express");
const bcrypt = require("bcrypt");
const userData = require("../data/users");
const router = express.Router();

const saltRounds = 5;

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

  const { username, password, confirmPassword, phone, email } = req.body;
  // Jake:
  // Please do the form validation with following rules:
  // 1. Username must only contain [A-Za-z0-9_]
  // 2. Password must apply following rules:
  //    - At least has length of 6
  //    - At least one UPPERCASE character
  //    - At least one lowercase character
  //    - At lease one number
  //  If the rules is not satisfied, please render the signup template passing a attribute with value as true and I will make the signup page render with alert according to the attribute you enter.
  //  See example here when I render the signup with 'passwordNotMatch

  if (password !== confirmPassword) {
    // check if the 2 input passwords matched
    return res.render("template/signup", { passwordNotMatch: true });
  }

  let userExisted; // check if the given username has been registered
  try {
    userExisted = await userData.getUserByUsername(username);
  } catch (e) {
    console.log(e);
  }

  if (userExisted) {
    // if the username register, return render the signup page with an alter
    return res
      .status(400)
      .json({ error: { status: 400, msg: "usernae existed!!" } });
  }

  let newUser; // for the sake of scope
  try {
    // encrpyt the password and add newUser
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    newUser = await userData.addUser(username, hashedPassword, phone, email);
  } catch (e) {
    console.log(e);
    return res.status(500).render("tempalte/error", {
      error: { status: 500, msg: "Sorry, something goes wrong on our end :(" }
    });
  }

  if (!newUser) {
    return res.status(500).render("tempalte/error", {
      error: { status: 500, msg: "Sorry, something goes wrong on our end :(" }
    });
  }

  return res.status(200).json({ status: 200, user: newUser });
});

router.get("/logout", async (req, res) => {
  console.log("in GET /authen/logout");
  console.log(req.session);

  req.session.destroy();

  return res.status(200).json({
    status: 200,
    msg: "successfully hit the route!",
    currentRoute: "POST /authen/logout"
  });
});

module.exports = router;

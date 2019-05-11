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

  const username = req.body.userAccount;

  let found_user;
  try {
    found_user = await userData.getUserByUsername(username);
  } catch (e) {
    if (e === "username is not existed") {
      return res.render("template/login", { credentialInvalid: true });
    }
  }
  if (!found_user) {
    return res.status(500).render("template/error", {
      error: { status: 500, msg: "something goes wrong in our end..." }
    });
  }

  const passwd = req.body.userPassword;
  const passwd_accepted = await bcrypt.compare(
    passwd,
    found_user.hashedPassword
  );
  if (passwd_accepted) {
    req.session.user = {
      userId: found_user._id,
      userName: found_user.username,
      userAsset: found_user.virtualConcurrency
    };
    return res.redirect("/");
  } else {
    return res.render("template/login", { credentialInvalid: true });
  }
});

router.get("/signup", async (req, res) => {
  console.log("in GET /authen/signup");

  return res.render("template/signup", {});
});

router.post("/signup", async (req, res) => {
  console.log("in POST /authen/signup");

  const { username, password, confirmPassword, phone, email } = req.body;

  for (let i = 0; i < username.length; i++) {
    if (
      !(
        (username.charCodeAt(i) <= 90 && username.charCodeAt(i) >= 65) ||
        (username.charCodeAt(i) >= 48 && username.charCodeAt(i) <= 57) ||
        (username.charCodeAt(i) >= 97 && username.charCodeAt(i) <= 122)
      )
    ) {
      //this means every character is within our constraints
      return res.render("template/signup", { usernameNotValid: true }); //HANDLE THIS IN ALERTS
    }
  }

  let Uppercase = false;
  let Lowercase = false;
  let number_exists = false;

  //setting a minimum password length
  if (password.length < 6) {
    return res.render("template/signup", { passwordNotLongEnough: true }); //HANDLE THIS IN ALERTS
  }

  //loop through password to check each character
  for (let j = 0; j < password.length; j++) {
    let temp = password.charAt(j);
    //is there at least one uppercase?
    if (temp == temp.toUpperCase()) {
      Uppercase = true;
    }
    if (temp == temp.toLowerCase()) {
      //is there at least one lowercase?
      Lowercase = true;
    }
    if (!isNaN(temp)) {
      //is there at least one number?
      number_exists = true;
    }
  }

  //check all the constraints, if the user meets them, we fall through
  if (!(Uppercase && Lowercase && number_exists)) {
    return res.render("template/signup", { passwordNotStrong: true }); //HANDLE THIS IN ALERTS
  }

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
    return res.render("template/signup", { usernameExist: true });
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

  return res.redirect("/authen/login");
});

router.get("/logout", async (req, res) => {
  console.log("in GET /authen/logout");
  console.log(req.session);

  req.session.destroy();

  return res.redirect("/");
});

module.exports = router;

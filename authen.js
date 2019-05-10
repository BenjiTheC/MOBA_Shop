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
  const found_user = await userData.getUserByUsername(username);
  if (!found_user){
    console.log("User not found!");
    res.render("template/login", {});
    return;
  }

  const passwd = req.body.userPassword;
  const passwd_accepted = await bcrypt.compare(passwd, found_user.hashedPassword);
  if (passwd_accepted){
    req.session.user = found_user;
    res.redirect('/');
  } else{
    res.render('template/login', {});
  }

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
  // All of these rules have been specified and followed! -Jake

  for (let i = 0; i < username.length; i++){
    if (!(((username.charCodeAt(i) <= 90) && (username.charCodeAt(i) >= 65)) || ((username.charCodeAt(i) >= 48) && (username.charCodeAt(i) <= 57)) || ((username.charCodeAt(i) >= 97) && username.charCodeAt(i) <= 122))){
      //this means every character is within our constraints
      return res.render("template/signup", { usernameNotValid: true }); //HANDLE THIS IN ALERTS
    } 
  }

  let Uppercase = false;
  let Lowercase = false;
  let number_exists = false;

  //setting a minimum password length
  if (password.length < 6){
    return res.render("template/signup", { passwordNotLongEnough: true}); //HANDLE THIS IN ALERTS
  }

  //loop through password to check each character
  for (let j = 0; j < password.length; j++){
    let temp = password.charAt(j);
    //is there at least one uppercase?
    if (temp == temp.toUpperCase()){
      Uppercase = true;
    } else if (temp == temp.toLowerCase()){ //is there at least one lowercase?
      Lowercase = true;
    } else if (!isNaN(temp)){ //is there at least one number?
      number_exists = true;
    }
  }

  //check all the constraints, if the user meets them, we fall through
  if (!(Uppercase && Lowercase && number_exists)){
    return res.render("template/signup", { passwordNotStrong: true}); //HANDLE THIS IN ALERTS
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
    return res
      .status(400)
      .json({ error: { status: 400, msg: "username existed!!" } });
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
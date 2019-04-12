const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
//const itemData = data.items;

router.get("/", async (req, res) => {
    try{
        const userList = await userData.getAllUsers()
        //to be implemented
        //...
        //res.render()

        res.json(userList)
    }catch (e) {
        res.status(500).send();
    }
});

router.get("/:id", async (req, res) => {
    try{
        const user = await userData.getUserById(req.params.id)
        //to be implemented
        //...
        //res.render()
        res.json(user)
    }catch (e) {
        res.status(404).json({ message: "User not found" });
    }
});

router.post("/", async (req, res) => {
    const newUserInfo = req.body;

    if (!newUserInfo.userInfo.name) {
        res.status(400).json({ error: "You must provide name to create a user" });
        return;
    }
    if (!newUserInfo.userInfo.address) {
        res.status(400).json({ error: "You must provide a address to create a user" });
        return;
    }
    if (!newUserInfo.email) {
        res.status(400).json({ error: "You must provide a type" });
        return;
    }

    try {
        const newUser = await userData.addUser(newUserInfo.userInfo,newUserInfo.email)
        //to be implemented
        //...
        //res.render()
        res.json(newUser);
    } catch (e) {
        res.sendStatus(500);
    }
});
module.exports = router;
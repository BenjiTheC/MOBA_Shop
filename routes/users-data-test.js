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
        res.sendStatus(500);
        return;
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
        return;
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
        return;
    }
});

router.delete("/:id", async (req, res) => {
    try{
        await userData.getUserById(req.params.id)
    }catch (e) {
        res.status(404).json({ error: "User not found" })
    }

    try{
        const user =await userData.getUserById(req.params.id)
        //to be implemented
        await userData.deleteUser(req.params.id)
        res.json(user)
        return;
    }catch (e) {
        res.sendStatus(500);
        return;
    }
});

router.put("/:id", async (req,res) => {

    const inputInfo = req.body

    if (!inputInfo) {
        res.status(400).json({error: "You must provide data to update a user"});
        return;
    }
    if (!inputInfo.userInfo.name && !inputInfo.userInfo.address && !inputInfo.email) {
        res.status(400).json({error: "you must provide a name or address or email to be updated"});
        return;
    }
    try{
        await userData.getUserById(req.params.id)
    }catch (e) {
        res.status(404).json({error: "User not found"});
        return;
    }
    try{
        const updatedUser = await userData.updateUser(req.params.id, inputInfo)
        //to be implemented

        res.json(updatedUser)
    }catch (e) {
        res.sendStatus(500)
    }

})



module.exports = router;
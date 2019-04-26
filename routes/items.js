const express = require("express");
const router = express.Router();
const data = require("../data");
const itemData = data.items;

router.get("/", async (req, res) => {
    try{
        const itemList = await itemData.getAllItems();
        //to be implemented
        //...
        //res.render()

        res.json(itemList)
    }catch (e) {
        res.sendStatus(500);
        return;
    }
});

router.get("/:id", async (req, res) => {
    try{
        const item = await itemData.getItemById(req.params.id)
        //to be implemented
        //...
        //res.render()
        res.json(item)
    }catch (e) {
        res.status(404).json({ message: "User not found" });
        return;
    }
});

router.post("/", async (req,res) => {
    const newItemInfo = req.body;

    if (!newItemInfo.ownerId) {
        res.status(400).json({ error: "You must provide the owner id to add a item" });
        return;
    }
    if (!newItemInfo.amount) {
        res.status(400).json({ error: "You must provide the amount to add a item" });
        return;
    }
    if (!newItemInfo.information.description) {
        res.status(400).json({ error: "You must provide the description to add a item" });
        return;
    }
    if (!newItemInfo.information.image) {
        res.status(400).json({ error: "You must provide the image url to add a item" });
        return;
    }

    try{
        const newItem = await itemData.addItem(newItemInfo.ownerId, newItemInfo.amount, newItemInfo.information)
        //to be implemented
        //...
        //res.render()
        res.json(newItem);
    }catch (e) {
        res.sendStatus(500);
        return;
    }
});

module.exports = router;
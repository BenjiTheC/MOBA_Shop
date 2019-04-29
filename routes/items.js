const express = require("express");
const router = express.Router();
const data = require("../data");
const itemData = data.items;
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }
});

const upload = multer({storage: storage})
//can add limit for image here


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

router.post("/", upload.single("itemImage"), async (req,res) => {
    //console.log(req.file)
    //console.log(req.body)
    const newItemInfo = req.body;

    if (!newItemInfo.ownerId) {
        res.status(400).json({ error: "You must provide the owner id to add a item" });
        return;
    }
    if (!newItemInfo.name) {
        res.status(400).json({ error: "You must provide a name to add a item" });
        return;
    }
    if (!newItemInfo.description) {
        res.status(400).json({ error: "You must provide the description to add a item" });
        return;
    }
    if (!newItemInfo.price) {
        res.status(400).json({ error: "You must provide the price to add a item" });
        return;
    }
    if (!newItemInfo.amount) {
        res.status(400).json({ error: "You must provide the amount to add a item" });
        return;
    }
    if (!newItemInfo.tag) {
        res.status(400).json({ error: "You must provide a tag to add a item" });
        return;
    }
    newItemInfo.information = {
        name: newItemInfo.name,
        description: newItemInfo.description,
        image: req.file.path.replace(/\\/g, "/"), //get path here
        price: newItemInfo.price,
        amount: newItemInfo.amount
    }

    try{
        const newItem = await itemData.addItem(newItemInfo.ownerId, newItemInfo.information, newItemInfo.tag)
        //to be implemented
        //...
        //res.render()
        res.json(newItem);
    }catch (e) {
        console.log(e)
        res.sendStatus(500);
        return;
    }
});

module.exports = router;
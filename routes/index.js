const userRoutes = require("./users");
//const itemRoutes = require("./posts")

const constructorMethod = app => {
    app.use("/users", userRoutes);
    //app.use("/items", itemRoutes);

    app.use("*", (req, res) => {
        res.status(404).json({ error: "Not found" });
    });
};

module.exports = constructorMethod;
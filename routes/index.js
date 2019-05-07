const userRoutes = require("./users-data-test");
const mainRoutes = require("./main");
const searchRoutes = require("./search");
const itemRoutes = require("./items");
const cartRoutes = require('./cart');

const constructorMethod = app => {
    app.use("/", mainRoutes);
    app.use("/users", userRoutes);
    app.use("/items", itemRoutes);
    app.use("/search", searchRoutes);
    app.use('/user/:uid/cart', cartRoutes);

    app.use("*", (req, res) => {
        res.status(404).json({ error: "Page Not found" });
    });
};

module.exports = constructorMethod;
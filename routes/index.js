const userRoutes = require("./users");
const mainRoutes = require("./main");
const searchRoutes = require("./search");
const itemRoutes = require("./items");
const authenRoutes = require("./authen");

const testRoutes = require("./frontend_test");

const constructorMethod = app => {
    app.use("/", mainRoutes);
    app.use("/users", userRoutes);
    app.use("/items", itemRoutes);
    app.use("/search", searchRoutes);
    app.use("/authen", authenRoutes);

    app.use("/test", testRoutes);

    app.use("*", (req, res) => {
        res.status(404).json({ error: "Page Not found" });
    });
};

module.exports = constructorMethod;
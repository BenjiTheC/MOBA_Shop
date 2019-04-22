const userRoutes = require("./users-data-test");
const mainRoutes = require("./main");
const searchRoutes = require("./search");
//const itemRoutes = require("./posts")

const constructorMethod = app => {
    app.use("/", mainRoutes);
    app.use("/users", userRoutes);
    app.use("/search", searchRoutes);

    app.get("/demo", (req, res) => {
        res.render('template/codepen_demo');
    })

    app.use("*", (req, res) => {
        res.status(404).json({ error: "Page Not found" });
    });
};

module.exports = constructorMethod;
const userRoutes = require("./users-data-test");
const searchRoutes = require("./search");
//const itemRoutes = require("./posts")

const constructorMethod = app => {
    app.use("/users", userRoutes);
    app.use("/search", searchRoutes);
    //app.use("/items", itemRoutes);
    app.get('/', async (req, res) => {
        res.render('template/home', { title: "MOBA Shop" })
    })

    app.use("*", (req, res) => {
        res.status(404).json({ error: "Not found" });
    });
};

module.exports = constructorMethod;
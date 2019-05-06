const userRoutes = require("./users");
const mainRoutes = require("./main");
const searchRoutes = require("./search");
const itemRoutes = require("./items");
const authenRoutes = require("./authen");

const { isAuthenticated } = require("../middlewares");

const testRoutes = require("./frontend_test");

const constructorMethod = app => {
  app.use("/", mainRoutes);
  app.use("/users", isAuthenticated, userRoutes);
  app.use("/items", itemRoutes);
  app.use("/search", searchRoutes);
  app.use("/authen", authenRoutes);

  app.use("/test", testRoutes); // for the frontend testing only

  app.use("*", (req, res) => {
    res.redirect("");
  });
};

module.exports = constructorMethod;

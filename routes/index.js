const userRoutes = require("./users");
const mainRoutes = require("./main");
const searchRoutes = require("./search");
const itemRoutes = require("./items");
const authenRoutes = require("./authen");
const cartRoutes = require("./cart");
const conversationRoutes = require("./conversation");
const { isAuthenticated } = require("../middlewares");

const constructorMethod = app => {
  app.use("/", mainRoutes);
  app.use("/users", isAuthenticated, userRoutes); // every request trying to hit this route need to be logged in
  app.use("/items", itemRoutes);
  app.use("/search", searchRoutes);
  app.use("/authen", authenRoutes);
  app.use("/cart", cartRoutes);
  app.use("/conversation", conversationRoutes);

  app.use("*", (req, res) => {
    res.redirect("/");
  });
};

module.exports = constructorMethod;

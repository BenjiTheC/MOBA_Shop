const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();
const static = express.static(__dirname + "/public");
const { myLogger } = require("./middlewares");
const configRoutes = require("./routes"); // get routes into the app
const exphbs = require("express-handlebars");

app.use(
  session({
    name: "AuthCookie",
    secret: "Secret Shit",
    resave: false,
    saveUninitialized: true
  })
);
app.use(myLogger);
app.use("/public", static);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(3000, () => {
  console.log("MOBA shop web app server running");
  console.log("Routes on http://localhost:3000/");
});

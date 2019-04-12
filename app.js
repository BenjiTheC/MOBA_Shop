const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const static = express.static(__dirname + "/public");

const configRoutes = require("./routes");  // get routes into the app
const exphbs = require("express-handlebars");

app.use("/public", static);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine("handlebars", exphbs({ defaultLayout: true }));
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(3000, () => {
    console.log('MOBA shop web app server running');
    console.log('Routes on http://localhost:3000'); // the url will be changed in the future
});

const dbConnection = require("../data/connection");
const data = require("../data/");
const MongoClient = require("mongodb").MongoClient;
const users = data.users;
const items = data.items;
const bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(5);
const fs = require("fs");

// var hash = bcrypt.hashSync("B4c0/\/", salt);

let CONNECTION = undefined;
let DATABASE = undefined;

const dbInitiation = async () => {
  if (!CONNECTION) {
    CONNECTION = await MongoClient.connect("mongodb://localhost:27017/", {
      useNewUrlParser: true
    });
    DATABASE = await CONNECTION.db("MOBA_Shop_DB");
  }
  console.log("Database connected.");
};

async function addItemsByUser(userObj, tag, startIndex, endIndex, cnt) {
  const itemsLst = fs.readdirSync(`./seed/item_images_${tag}`); // path to retrieve images
  const description =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Egestas dui id ornare arcu odio ut sem nulla pharetra.";
  const price = Math.floor(Math.random() * (5000 - 1000)) + 1000;

  for (let i = startIndex; i < endIndex; i++) {
    const name = itemsLst[i] // use string manipulation and regex to populate the name
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()0-9]/g, " ")
      .replace("png", "")
      .replace(/  +/g, " ");
    const image = `public/items_img/${itemsLst[i]}`;
    const information = { name, description, image, price };

    await items.addItem(userObj._id, information, tag);
    fs.copyFile(
      `./seed/item_images_${tag}/${itemsLst[i]}`,
      `./${image}`,
      err => {
        if (err) throw err;
        console.log(
          `${userObj.username} | ${cnt++} | ./seed/item_images_${tag}/${
            itemsLst[i]
          } ==> ./${image}`
        );
      }
    );
  }
}

async function main() {
  await dbInitiation();
  await DATABASE.dropDatabase();

  const CamilleSquare = await users.addUser(
    "CamilleSquare",
    bcrypt.hashSync("Test123", salt),
    "2010000000",
    "CamilleSquare@gmail.com"
  );

  const EkkoSquare = await users.addUser(
    "EkkoSquare",
    bcrypt.hashSync("Test123", salt),
    "2010000001",
    "EkkoSquare@gmail.com"
  );

  const FioraSquare = await users.addUser(
    "FioraSquare",
    bcrypt.hashSync("Test123", salt),
    "2010000002",
    "FioraSquare@gmail.com"
  );

  //add items
  let CNT = 0;
  await addItemsByUser(CamilleSquare, "lol", 22, 37, CNT);
  await addItemsByUser(EkkoSquare, "dota", 44, 60, CNT);
  await addItemsByUser(FioraSquare, "lol", 100, 115, CNT);

  console.log("Done seeding database");
  console.log(`
  Hi Prof. Hill!
  Please press ctrl-c for this script to exit, as the MongoDB has changed the metod of closing the database. :p
  `);
  try {
    await CONNECTION.close(); //meet a problem here!!!!!!
  } catch (e) {
    console.log(e);
  }
  process.exit(0);
}

main().catch(console.error);

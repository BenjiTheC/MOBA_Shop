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

async function addItemsByUser(userObj, tag, startIndex, cnt) {
  const itemsLst = fs.readdirSync(`./seed/item_images_${tag}`); // path to retrieve images

  for (let i = startIndex; i < startIndex + 15; i++) {
    // create the information of the item
    const information = {
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Egestas dui id ornare arcu odio ut sem nulla pharetra.",
      price: Math.floor(Math.random() * (5000 - 1000)) + 1000
    };
    information.name = itemsLst[i] // use string manipulation and regex to populate the name
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()0-9]/g, " ")
      .replace("png", "")
      .replace(/  +/g, " ");
    information.image = `public/uploads/${itemsLst[i]}`;

    // add item to database, copy the item image file to the public/ folder
    await items.addItem(userObj._id, information, tag);
    fs.copyFile(
      `./seed/item_images_${tag}/${itemsLst[i]}`,
      `./${information.image}`,
      err => {
        if (err) throw err;
        console.log(
          `${userObj.username} | ${cnt++} | ./seed/item_images_${tag}/${
            itemsLst[i]
          } ==> ./${information.image}`
        );
      }
    );
  }
}

async function main() {
  await dbInitiation();
  await DATABASE.dropDatabase();

  const benjamin = await users.addUser(
    "Benjamin",
    bcrypt.hashSync("Test123", salt),
    "2010000000",
    "benji@moba.com"
  );

  const siyuan = await users.addUser(
    "SiyuanHe",
    bcrypt.hashSync("Test123", salt),
    "2010000001",
    "databaseguru@moba.com"
  );

  const rob = await users.addUser(
    "Rob",
    bcrypt.hashSync("Test123", salt),
    "2010000002",
    "bestTA@moba.com"
  );

  const jake = await users.addUser(
    "JakeLovrin",
    bcrypt.hashSync("Test123", salt),
    "2010000003",
    "gamedevgeek@moba.com"
  );

  //add items
  let CNT = 0;
  await addItemsByUser(jake, "lol", 33, CNT);
  await addItemsByUser(rob, "dota", 68, CNT);
  await addItemsByUser(siyuan, "dota", 25, CNT);
  await addItemsByUser(benjamin, "lol", 100, CNT);

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

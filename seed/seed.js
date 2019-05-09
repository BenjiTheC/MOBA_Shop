const dbConnection = require("../data/connection");
const data = require("../data/");
const MongoClient = require("mongodb").MongoClient;
const users = data.users;
const items = data.items;
const bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(10);
// const fs = require("fs");

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

  const JaxSquare = await users.addUser(
    "JaxSquare",
    bcrypt.hashSync("Test123", salt),
    "2010000003",
    "JaxSquare@gmail.com"
  );

  const LissandraSquare = await users.addUser(
    "LissandraSquare",
    bcrypt.hashSync("Test123", salt),
    "2010000004",
    "JaxSquare@gmail.com"
  );

  const Master_YiSquare = await users.addUser(
    "Master_YiSquare",
    bcrypt.hashSync("Test123", salt),
    "2010000005",
    "Master_YiSquare@gmail.com"
  );

  const YasuoSquare = await users.addUser(
    "YasuoSquare",
    bcrypt.hashSync("Test123", salt),
    "2010000006",
    "YasuoSquare@gmail.com"
  );

  await items.addItem(
    CamilleSquare._id,
    {
      name: "Abyssal_Mask",
      description:
        "The aura increases in size if their users increase in size.",
      image: "seed/item_images_lol/Abyssal_Mask.png",
      price: "3000",
      amount: "1"
    },
    "lol"
  );

  // const lolItems = fs.readdirSync('item_images_lol/');
  // for (let i = 0; i < lolItems.length; i ++){
  //     console.log(lolItems[i])
  // }

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
}

main().catch(console.error);

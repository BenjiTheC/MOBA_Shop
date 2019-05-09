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
  const lolItems = fs.readdirSync('item_images_lol/');
  const dotaItems = fs.readdirSync('item_images/');

  for (let i = 0; i < 5; i ++){
      await items.addItem(
          CamilleSquare._id,
          {
              name: lolItems[i].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()0-9]/g," ").replace("png","").replace( /  +/g, ' ' ),
              description:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Egestas dui id ornare arcu odio ut sem nulla pharetra.",
              image: "seed/item_images_lol/" + lolItems[i],
              price: Math.floor(Math.random() * (5000 - 1000)) + 1000// Math.floor(Math.random() * (max - min)) + min;
          },
          "lol"
      );
  }

    for (let i = 5; i < 10; i ++){
        await items.addItem(
            EkkoSquare._id,
            {
                name: lolItems[i].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()0-9]/g," ").replace("png","").replace( /  +/g, ' ' ),
                description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Egestas dui id ornare arcu odio ut sem nulla pharetra.",
                image: "seed/item_images_lol/" + lolItems[i],
                price: Math.floor(Math.random() * (5000 - 1000)) + 1000// Math.floor(Math.random() * (max - min)) + min;
            },
            "lol"
        );
    }

    for (let i = 0; i < 5; i ++){
        await items.addItem(
            FioraSquare._id,
            {
                name: dotaItems[i].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()0-9]/g," ").replace("png","").replace( /  +/g, ' ' ),
                description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Egestas dui id ornare arcu odio ut sem nulla pharetra.",
                image: "seed/item_images/" + dotaItems[i],
                price: Math.floor(Math.random() * (5000 - 1000)) + 1000// Math.floor(Math.random() * (max - min)) + min;
            },
            "dota"
        );
    }

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

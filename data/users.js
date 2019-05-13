const mongoCollections = require("./collections");
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const dot = require("mongo-dot-notation");

const exportedMethod = {
  async getAllUsers() {
    const userCollection = await users();
    const allUser = await userCollection.find({}).toArray();
    return allUser;
  },

  async getUserById(id) {
    //console.log(ObjectId.isValid(id))
    if (!id) throw "you must provide an id to search for";
    if (!ObjectId.isValid(id)) throw "invalid input id";
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: ObjectId(id) });
    if (user === null) throw "no user with that id";
    return user;
  },

  async getUserByUsername(username) {
    if (!username) throw "No username provided!";
    if (typeof username !== "string")
      throw "You are giving the wrong type of username!";

    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });

    if (user === null) {
      throw "username is not existed";
    }

    return user;
  },

  //userName (string): The name set for user at account creation
  //userPassword (string): The password set for privacy
  //Phone: phone number of the user
  //Email: email used for registration.
  //Virtual Concurrency: the “money” users will be using for trading on the platform. Number.MAX_SAFE_INTEGER
  //Purchase History: sub-document with record of purchasing of the user.
  async addUser(username, hashedPassword, phone, email) {
    if (!username) throw "you must provide a userName";
    if (!hashedPassword) throw "you must provide a password";
    if (!phone) throw "you must provide a phone number";
    if (!email) throw "you must provide a email";

    const userCollection = await users();

    let newUser = {
      username: username,
      hashedPassword: hashedPassword,
      phone: phone,
      email: email,
      virtualConcurrency: Number.MAX_SAFE_INTEGER, // automatically assigned in the future
      purchaseHistory: []
    };
    const insertInfo = await userCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) throw "can not add user";
    const newId = insertInfo.insertedId;
    const user = await this.getUserById(newId);
    return user;
  },

  async deleteUser(id) {
    if (!id) throw "you must provide an id to search for";
    if (!ObjectId.isValid(id)) throw "invalid input id";
    const userCollection = await users();
    const deletionInfo = await userCollection.removeOne({ _id: ObjectId(id) });
    if (deletionInfo.deletedCount === 0)
      throw "Could not delete user with id of ${id}";
  },

  async purchaseUpdate(userId, updateObj) {
    if (!userId) throw "you must provide an id to search for";
    if (updateObj.virtualConcurrency === undefined)
      throw "virtualConcrrency data missing!";
    if (!updateObj.purchaseHistory || !Array.isArray(updateObj.purchaseHistory))
      throw "purchaseHistory invalid!";

    const userCollection = await users();

    try {
      const updatedInfo = await userCollection.updateOne(
        { _id: ObjectId(userId) },
        {
          $set: { virtualConcurrency: updateObj.virtualConcurrency },
          $addToSet: { purchaseHistory: { $each: updateObj.purchaseHistory } }
        }
      );
      console.log(updatedInfo);
    } catch (e) {
      console.log(e);
    }
    return await this.getUserById(userId);
  },

  async updateUser(id, updateUser) {
    if (!id) throw "you must provide an id to search for";
    if (!ObjectId.isValid(id)) throw "invalid input id";

    //add new info here
    if (!updateUser.phone && !updateUser.email) {
      throw "you must provide a nick name or phone or age or gender or email to be updated";
    }
    const userCollection = await users();

    let updateData = {};

    //add new info here
    if (updateUser.email) updateData.email = updateUser.email;
    if (updateUser.phone) updateData.phone = updateUser.phone;

    //use dot.flatten to flatten the data in updateData for update a specific data in userInfo
    const updatedInfo = await userCollection.updateOne(
      { _id: ObjectId(id) },
      dot.flatten(updateData)
    );
    if (updatedInfo.modifiedCount === 0)
      throw "can not update user successfully";
    return await this.getUserById(ObjectId(id));
  }
};

module.exports = exportedMethod;

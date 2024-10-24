const { ObjectId } = require("mongodb");
const { client } = require("../config/db");
const usersCollection = client.db("TubeNest").collection("users");

const getAllUsers = async (req, res) => {
  try {
    const result = await usersCollection.find().toArray();
    res.status(200).send(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = { getAllUsers };

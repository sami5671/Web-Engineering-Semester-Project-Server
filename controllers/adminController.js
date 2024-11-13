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
const giveAccessToUsers = async (req, res) => {
  try {
    const userId = req.body.userId;

    // Find the user by ID
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    // If user doesn't exist, return 404 error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's status and request
    const updatedUser = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) }, // Search criteria
      { $set: { request: "accepted", status: "moderator" } }, // Fields to update
      { returnDocument: "after" } // Return the updated document after modification
    );

    // Send response with updated user data
    return res.status(200).json({
      message: "User status updated to moderator",
      user: updatedUser.value,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred", error });
  }
};

module.exports = { getAllUsers, giveAccessToUsers };

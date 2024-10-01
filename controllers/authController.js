const jwt = require("jsonwebtoken");
const { client } = require("../config/db");
const usersCollection = client.db("TubeNest").collection("users");

// Register User
const registerUser = async (req, res) => {
  const user = req.body;
  const query = { email: user.email };

  try {
    const isExist = await usersCollection.findOne(query);
    if (isExist) {
      return res.status(409).send({ message: "User already exists" });
    } else {
      const result = await usersCollection.insertOne(user);
      return res.send(result);
    }
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Server error", error: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const user = req.body;
  const query = { email: user.email };

  const isExist = await usersCollection.findOne(query);
  if (isExist && isExist.password === user.password) {
    return res.send(isExist);
  } else {
    return res.status(404).send({ message: "Invalid credentials" });
  }
};

const generateToken = (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  res.send(token);
};

module.exports = { registerUser, loginUser, generateToken };

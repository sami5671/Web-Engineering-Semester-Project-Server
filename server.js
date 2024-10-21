const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB } = require("./config/db");

const app = express();
const port = process.env.PORT || 9000;

const authRoutes = require("./routes/authRoutes");
const videoRoutes = require("./routes/videoRoutes");
const userRoutes = require("./routes/userRoutes");

const corsOptions = {
  origin: ["http://localhost:5173"],
  // origin: ["https://tube-nest.web.app"],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/videos", videoRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Tube Nest Server is Alive...");
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

module.exports = app;

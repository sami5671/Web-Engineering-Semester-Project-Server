const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

const port = process.env.PORT || 9000;

// ------------------- middleware ----------------------------------------------------------------
const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// ======================== MongoDB =========================================

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fmvmv30.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // -----------------------------All Collections-----------------------------------------------------------------------
    const usersCollection = client.db("TubeNest").collection("users");
    const videosCollection = client.db("TubeNest").collection("videos");

    // -----------------------------Auth Related Api---------------------------------------------------------------------------------------
    // Getting the Token from server
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.send(token);
      console.log(token);
    });
    // save user in database
    app.post("/saveUser", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const isExist = await usersCollection.findOne(query);

      console.log("User found?----->", isExist);

      if (isExist) {
        return res.send(isExist);
      } else {
        const result = await usersCollection.insertOne(user);
        res.send(result);
      }
    });

    // -------------------- videos API-----------------------------------------------------
    // get all videos
    app.get("/videos", async (req, res) => {
      const result = await videosCollection.find().toArray();
      res.send(result);
    });
    //get single video
    app.get("/videos/:videoId", async (req, res) => {
      const videoId = req.params.videoId;
      const result = await videosCollection.findOne({
        _id: new ObjectId(videoId),
      });
      res.send(result);
    });
    // add a video
    app.post("/videos", async (req, res) => {
      const video = req.body;
      const result = await videosCollection.insertOne(video);
      res.send(result);
    });
    // edit a video
    app.patch("/editVideo/:videoId", async (req, res) => {
      const videoId = req.params.videoId;
      const video = req.body;

      const filterVideo = { _id: new ObjectId(videoId) };
      const updateDoc = {
        $set: {
          title: video.title,
          author: video.author,
          description: video.description,
          link: video.link,
          thumbnail: video.thumbnail,
          date: video.date,
          duration: video.duration,
          views: video.views,
        },
      };
      const result = await videosCollection.updateOne(filterVideo, updateDoc);
      res.send(result);
    });
    // delete a video
    app.delete("/videos/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await videosCollection.deleteOne(query);
      res.send(result);
    });
    // --------------------------------------------------------------------------------------------------------------------
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// =================================================================
// ---------------------------------------------------------------------------------------------
app.get("/", (req, res) => {
  res.send("Tube Nest Server is Alive.............");
});

app.listen(port, () => {
  console.log(`Tube Nest Server is running on port ${port}`);
});

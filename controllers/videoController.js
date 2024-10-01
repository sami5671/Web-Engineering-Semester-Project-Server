const { ObjectId } = require("mongodb");
const { client } = require("../config/db");
const videosCollection = client.db("TubeNest").collection("videos");

// Get all videos
const getAllVideos = async (req, res) => {
  const result = await videosCollection.find().toArray();
  res.send(result);
};

// Get a single video
const getVideoById = async (req, res) => {
  const videoId = req.params.videoId;
  const result = await videosCollection.findOne({ _id: new ObjectId(videoId) });
  res.send(result);
};

// Add a video
const addVideo = async (req, res) => {
  const video = req.body;
  const result = await videosCollection.insertOne(video);
  res.send(result);
};

// Edit a video
const editVideo = async (req, res) => {
  const videoId = req.params.videoId;
  const video = req.body;

  const filter = { _id: new ObjectId(videoId) };
  const updateDoc = { $set: video };
  const result = await videosCollection.updateOne(filter, updateDoc);
  res.send(result);
};

// Delete a video
const deleteVideo = async (req, res) => {
  const id = req.params.id;
  const result = await videosCollection.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
};

module.exports = {
  getAllVideos,
  getVideoById,
  addVideo,
  editVideo,
  deleteVideo,
};

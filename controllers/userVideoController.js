const { ObjectId } = require("mongodb");
const { client } = require("../config/db");
const videosCollection = client.db("TubeNest").collection("videos");
const userSaveVideosCollection = client.db("TubeNest").collection("saveVideos");

const likeVideo = async (req, res) => {
  const videoId = req.params.id;
  const userEmail = req.body.email;

  try {
    if (!userEmail) {
      res.status(404).send({ message: "Please login first" });
    } else {
      // find
      const video = await videosCollection.findOne({
        _id: new ObjectId(videoId),
      });

      if (!video) {
        return res.status(404).send({ message: "Video not found" });
      }
      // if email not exist
      if (!video.likeEmail.includes(userEmail)) {
        const updateDoc = {
          $pull: { dislikeEmail: userEmail },
          $push: { likeEmail: userEmail },
        };
        //  save to database
        const result = await videosCollection.updateOne(video, updateDoc);
        res.send(result);
      } else {
        res.status(400).send({ message: "Already liked this video" });
      }
    }
  } catch (error) {
    res.status(500).send({ message: "An error occurred" });
  }
};

const disLikeVideo = async (req, res) => {
  const videoId = req.params.id;
  const userEmail = req.body.email;

  try {
    if (!userEmail) {
      res.status(404).send({ message: "Please login first" });
    } else {
      // find
      const video = await videosCollection.findOne({
        _id: new ObjectId(videoId),
      });

      if (!video) {
        return res.status(404).send({ message: "Video not found" });
      }
      // if email not exist
      if (!video.dislikeEmail.includes(userEmail)) {
        const updateDoc = {
          $pull: { likeEmail: userEmail },
          $push: { dislikeEmail: userEmail },
        };
        //  save to database
        const result = await videosCollection.updateOne(video, updateDoc);
        res.send(result);
      } else {
        res.status(400).send({ message: "Already disliked this video" });
      }
    }
  } catch (error) {
    res.status(500).send({ message: "An error occurred" });
  }
};

const saveVideo = async (req, res) => {
  const videoId = req.params.id;
  const userEmail = req.body.email;

  if (!userEmail) {
    return res.status(400).send({ message: "Please Login First" });
  }
  try {
    const filterVideo = { videoId, userEmail };
    const existsVideo = await userSaveVideosCollection.findOne(filterVideo);

    if (!existsVideo) {
      const saveData = {
        videoId,
        userEmail,
      };
      const result = await userSaveVideosCollection.insertOne(saveData);
      return res.send(result);
    } else {
      return res
        .status(400)
        .send({ message: "You have already saved this video" });
    }
  } catch (error) {
    return res.status(500).send({ message: "An error occurred" });
  }
};

const getUserSaveVideos = async (req, res) => {
  //   console.log(req.params.email);
  const userEmail = req.params.email;
  try {
    const saveVideos = await userSaveVideosCollection
      .find({ userEmail })
      .toArray();

    if (saveVideos.length === 0) {
      return res
        .status(404)
        .send({ message: "No saved videos found for this user" });
    } else {
      const saveVideoIds = saveVideos.map(
        (video) => new ObjectId(video.videoId)
      );
      const finalVideos = await videosCollection
        .find({ _id: { $in: saveVideoIds } })
        .toArray();

      res.send(finalVideos);
    }
  } catch (error) {
    res.status(500).send({ message: "An error occurred getting saved videos" });
  }
};

const deleteSaveVideos = async (req, res) => {
  const videoId = req.params.id;
  const userEmail = req.body.email;
  //   console.log(videoId, userEmail);

  try {
    const filterVideo = { videoId, userEmail };
    const video = await userSaveVideosCollection.findOne(filterVideo);

    if (video) {
      const query = { _id: video._id };
      const result = await userSaveVideosCollection.deleteOne(query);

      if (result.deletedCount === 1) {
        res.send({ message: "Video deleted successfully" });
      }
    } else {
      res.send({ message: "Error Occurred" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "An error occurred while deleting the video" });
  }
};

module.exports = {
  likeVideo,
  disLikeVideo,
  saveVideo,
  getUserSaveVideos,
  deleteSaveVideos,
};

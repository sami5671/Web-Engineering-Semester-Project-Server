const express = require("express");
const {
  getAllVideos,
  getVideoById,
  addVideo,
  editVideo,
  deleteVideo,
} = require("../controllers/videoController");

const router = express.Router();

router.get("/", getAllVideos);
router.get("/:videoId", getVideoById);
router.post("/addVideo", addVideo);
router.patch("/editVideo/:videoId", editVideo);
router.delete("/deleteVideo/:id", deleteVideo);

module.exports = router;

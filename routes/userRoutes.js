const express = require("express");

const {
  likeVideo,
  disLikeVideo,
  saveVideo,
  getUserSaveVideos,
  deleteSaveVideos,
  userRequestSending,
} = require("../controllers/userVideoController");

const router = express.Router();

router.patch("/likeVideoApi/:id", likeVideo);
router.patch("/dislikeVideoApi/:id", disLikeVideo);
router.post("/postSaveVideo/:id", saveVideo);
router.get("/getSaveVideoUser/:email", getUserSaveVideos);
router.delete("/deleteUserSaveVideo/:id", deleteSaveVideos);
router.patch("/userRequestSend", userRequestSending);

module.exports = router;

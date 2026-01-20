const express = require("express");
const {
  getCurrentCourseProgress
} = require("../controller/courseProgressController");

const router = express.Router();

router.get("/get/:userId/:courseId", getCurrentCourseProgress);

module.exports = router;
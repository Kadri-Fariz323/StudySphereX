const express = require("express");
const {
  getCoursesByStudentId,
} = require("../controller/studentCourseController");

const router = express.Router();

router.get("/get/:studentId", getCoursesByStudentId);

module.exports = router;
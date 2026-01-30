const express = require("express");
const router = express.Router();

const {
  getAllCourses,
  getCourseDetails,
  checkCoursePurchaseInfo,
  getStudentStats,
} = require("../controller/studentController");

router.get("/get", getAllCourses);
router.get("/get/details/:id", getCourseDetails);
router.get("/purchase-info/:id/:studentId", checkCoursePurchaseInfo);
router.get("/stats/:studentId", getStudentStats);

module.exports = router;

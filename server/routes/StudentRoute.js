const express = require("express");
const router = express.Router();

const { getAllCourses, getCourseDetails, checkCoursePurchaseInfo } = require("../controller/studentController");

router.get('/get', getAllCourses)
router.get('/get/details/:id', getCourseDetails)
router.get("/purchase-info/:id/:studentId", checkCoursePurchaseInfo);


module.exports = router;

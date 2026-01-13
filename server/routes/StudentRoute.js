const express = require("express");
const router = express.Router();

const { getAllCourses, getCourseDetails } = require("../controller/studentController");

router.get('/get', getAllCourses)
router.get('/get/details/:id', getAllCourses)


module.exports = router;

const express = require("express");
const router = express.Router();

const {
  addNewCourse,
  getAllCourses,
  getCourseDetailsByID,
  updateCourseByID,
  saveFinalQuiz,
  deleteCourse,
} = require("../controller/CourseController");

router.post("/add", addNewCourse);
router.get("/get", getAllCourses);
router.get("/get/details/:id", getCourseDetailsByID);
router.put("/update/:id", updateCourseByID);
router.put("/:id/final-quiz", saveFinalQuiz);
router.delete("/delete/:courseId", deleteCourse);

module.exports = router;

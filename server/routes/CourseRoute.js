const express = require("express");
const router = express.Router();

const {
  addNewCourse,
  getAllCourses,
  getCourseDetailsByID,
  updateCourseByID,
  saveFinalQuiz,
  deleteCourse,
  getInstructorCourses,
  getInstructorStats,
  getEnrolledStudents,
} = require("../controller/CourseController");

router.post("/add", addNewCourse);

router.put("/update/:id", updateCourseByID);
router.put("/:id/final-quiz", saveFinalQuiz);

router.delete("/delete/:courseId", deleteCourse);

router.get("/get/instructor/:instructorId", getInstructorCourses);

router.get("/get", getAllCourses);
router.get("/get/details/:id", getCourseDetailsByID);
router.get("/get/instructor-stats/:instructorId", getInstructorStats);
router.get("/get/enrolled-students/:instructorId", getEnrolledStudents);

module.exports = router;

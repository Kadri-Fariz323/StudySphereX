const express = require('express');
const router = express.Router();

const {
  addNewCourse,
  getAllCourses,
  getCourseDetailsByID,
  updateCourseByID,
  saveFinalQuiz 
} = require("../controllers/courseController"); 

router.post("/add", addNewCourse);
router.get("/get", getAllCourses);
router.get("/get/details/:id", getCourseDetailsByID);
router.put("/update/:id", updateCourseByID);

router.put('/:id/final-quiz', saveFinalQuiz);

module.exports = router;
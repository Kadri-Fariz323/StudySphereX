const express = require("express");
const {
  getCurrentCourseProgress,
  resetCurrentCourseProgress,
  markCurrentLectureAsViewed,
  submitQuiz,
  unlockCertificate,
  getAllCompletedCertificates
} = require("../controller/courseProgressController");

const router = express.Router();

router.get("/get/:userId/:courseId", getCurrentCourseProgress);
router.post("/mark-lecture-viewed", markCurrentLectureAsViewed);
router.post("/reset-progress", resetCurrentCourseProgress);
router.post("/quiz/submit", submitQuiz);
router.post("/certificate/unlock", unlockCertificate);
router.get("/certificates/:userId", getAllCompletedCertificates);

module.exports = router;
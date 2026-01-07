const express = require('express');
const router = express.Router();
const { addQuizToCurriculum } = require('../controllers/courseController');

// Route to add a quiz to a specific curriculum item
// Example URL: /api/courses/654a.../curriculum/654b.../quiz
router.put('/:courseId/curriculum/:contentId/quiz', addQuizToCurriculum);

module.exports = router;
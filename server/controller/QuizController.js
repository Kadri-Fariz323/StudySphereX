const Course = require('../models/Course');

const addQuizToCurriculum = async (req, res) => {
  try {
    const { courseId, contentId } = req.params;
    const { quiz } = req.body; // Expecting the full quiz object here

    // 1. Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 2. Find the specific curriculum item (subdocument)
    const curriculumItem = course.curriculum.id(contentId);
    if (!curriculumItem) {
      return res.status(404).json({ message: "Curriculum content not found" });
    }

    // 3. Update the quiz field directly
    // This replaces any existing quiz with the new exact one you wanted
    curriculumItem.quiz = quiz;

    // 4. Save the parent document
    await course.save();

    res.status(200).json({ 
      success: true, 
      message: "Quiz saved successfully to curriculum",
      data: course 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { addQuizToCurriculum };
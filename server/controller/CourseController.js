const Course = require("../models/Course");

const addNewCourse = async (req, res) => {
  try {
    const courseData = req.body;
    const newlyCreatedCourse = new Course(courseData);
    const saveCourse = await newlyCreatedCourse.save();

    if (saveCourse) {
      res.status(201).json({
        success: true,
        message: "Course saved successfully",
        data: saveCourse,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const coursesList = await Course.find({});

    res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getCourseDetailsByID = async (req, res) => {
  try {
    const { id } = req.params;
    const courseDetails = await Course.findById(id);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const updateCourseByID = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCourseData = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updatedCourseData,
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

// QUIZ

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
      data: course,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  addNewCourse,
  getAllCourses,
  updateCourseByID,
  getCourseDetailsByID,
  addQuizToCurriculum,
};

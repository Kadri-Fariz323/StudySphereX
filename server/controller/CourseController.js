const Course = require("../model/Course");
const mongoose = require("mongoose");

/* ===================== ADD COURSE ===================== */

const addNewCourse = async (req, res) => {
  try {
    const courseData = req.body;

    if (!courseData || Object.keys(courseData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Course data is required",
      });
    }

    const newlyCreatedCourse = new Course(courseData);
    const savedCourse = await newlyCreatedCourse.save();

    res.status(201).json({
      success: true,
      message: "Course saved successfully",
      data: savedCourse,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

/* ===================== GET ALL COURSES ===================== */
const getAllCourses = async (req, res) => {
  try {
    const coursesList = await Course.find({});
    res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

/* ===================== GET COURSE BY ID ===================== */
const getCourseDetailsByID = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

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
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

/* ===================== UPDATE COURSE ===================== */
const updateCourseByID = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
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
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

/* ===================== ADD QUIZ ===================== */

const saveFinalQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { quizData } = req.body; 
    // quizData should include: { title, questions, passingMarks }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Update the finalQuiz field directly
    course.finalQuiz = quizData;
    
    // Explicitly set certificate lock to true whenever quiz is updated
    course.isCertificateLocked = true;

    await course.save();

    res.status(200).json({
      success: true,
      message: "Final quiz updated successfully. It will effectively appear after the last lecture.",
      data: course
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { saveFinalQuiz };

module.exports = {
  addNewCourse,
  getAllCourses,
  updateCourseByID,
  getCourseDetailsByID,
  addQuizToCurriculum,
};

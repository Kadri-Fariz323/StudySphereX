const Course = require("../model/Course");
const mongoose = require("mongoose");

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

const getInstructorCourses = async (req, res) => {
  try {
    // Assuming you pass the instructorId in the URL params
    const { instructorId } = req.params;

    // FILTER: Only find courses where the instructorId matches
    const coursesList = await Course.find({ instructorId: instructorId });

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

const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete Course Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting course",
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      isPublished: true,
      approvalStatus: "approved", // Only fetch approved courses
    }).select("-students -curriculum"); // Exclude heavy data if needed

    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

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

const updateCourseByID = async (req, res) => {
  try {
    const { id } = req.params;
    const courseData = { ...req.body };

    delete courseData._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { $set: courseData },
      { new: true, runValidators: true },
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

const saveFinalQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const quizData =
      req.body.finalQuiz || req.body.courseFinalQuiz || req.body.quiz;

    if (!quizData) {
      return res.status(400).json({
        success: false,
        message: "Quiz data is missing in request body.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Course ID",
      });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    course.courseFinalQuiz = quizData;

    course.isCertificateLocked = true;

    await course.save();

    res.status(200).json({
      success: true,
      message: "Final quiz updated successfully",
      data: course,
    });
  } catch (error) {
    console.error("Save Quiz Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const getInstructorStats = async (req, res) => {
  try {
    const { instructorId } = req.params;

    if (!instructorId) {
      return res.status(400).json({ success: false, message: "Instructor ID is required" });
    }

    const courses = await Course.find({ instructorId });

    // 1. Initialize Stats
    let totalEnrolledStudents = 0;
    let totalRevenue = 0;
    let totalPendingCourses = 0;
    let totalRejectedCourses = 0;
    let totalApprovedCourses = 0;

    // 2. Activity Log Arrays
    let allEnrollments = [];
    let recentCourseUpdates = [];

    courses.forEach((course) => {
      // Logic for Status Counts
      if (course.approvalStatus === "pending") totalPendingCourses++;
      else if (course.approvalStatus === "rejected") totalRejectedCourses++;
      else if (course.approvalStatus === "approved") totalApprovedCourses++;

      // Track recent status changes (Pending/Rejected)
      if (course.approvalStatus !== "approved") {
        recentCourseUpdates.push({
          courseId: course._id,
          title: course.title,
          status: course.approvalStatus,
          updatedAt: course.date, // or use an actual updatedAt field if available
          rejectionReason: course.rejectionReason
        });
      }

      // Aggregate Enrollments & Revenue
      if (course.students && course.students.length > 0) {
        totalEnrolledStudents += course.students.length;
        course.students.forEach((student) => {
          totalRevenue += parseFloat(student.paidAmount) || 0;
          
          // Push to activity log
          allEnrollments.push({
            studentName: student.studentName,
            courseTitle: course.title,
            paidAmount: student.paidAmount,
            studentEmail: student.studentEmail,
            date: student._id.getTimestamp() // Mongoose IDs contain a timestamp
          });
        });
      }
    });

    // 3. Sort logs by date (newest first) and limit to top 5
    const recentEnrollments = allEnrollments
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);
      
    const recentUpdates = recentCourseUpdates
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        totalEnrolledStudents,
        totalMyCourses: courses.length,
        totalPendingCourses,
        totalRejectedCourses,
        totalRevenue,
        totalApprovedCourses,
        recentEnrollments, // New Activity Log
        recentUpdates     // New Activity Log
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
const getEnrolledStudents = async (req, res) => {
  try {
    const { instructorId } = req.params;
    // Get query params with defaults
    const { page = 1, limit = 10, search = "" } = req.query;

    if (!instructorId) {
      return res.status(400).json({
        success: false,
        message: "Instructor ID is required",
      });
    }

    const courses = await Course.find({ instructorId });

    // 1. Aggregate all students (Deduplication Logic)
    const enrolledStudentsMap = new Map();

    courses.forEach((course) => {
      if (course.students) {
        course.students.forEach((student) => {
          const existing = enrolledStudentsMap.get(student.studentId);
          const amount = Number(student.paidAmount) || 0;

          if (existing) {
            existing.totalAmount += amount;
          } else {
            enrolledStudentsMap.set(student.studentId, {
              studentId: student.studentId,
              studentName: student.studentName,
              studentEmail: student.studentEmail,
              totalAmount: amount,
            });
          }
        });
      }
    });

    let allStudents = Array.from(enrolledStudentsMap.values());

    // 2. Apply Search Filter (Case-insensitive)
    if (search) {
      const searchLower = search.toLowerCase();
      allStudents = allStudents.filter(
        (student) =>
          student.studentName.toLowerCase().includes(searchLower) ||
          student.studentEmail.toLowerCase().includes(searchLower),
      );
    }

    // 3. Apply Pagination (Slice the array)
    const totalStudents = allStudents.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + Number(limit);

    const paginatedStudents = allStudents.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      data: paginatedStudents,
      pagination: {
        totalStudents,
        currentPage: Number(page),
        totalPages: Math.ceil(totalStudents / limit),
      },
    });
  } catch (error) {
    console.error("Get Enrolled Students Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const getRejectedCourses = async (req, res) => {
  try {
    const { instructorId } = req.params;

    if (!instructorId) {
      return res.status(400).json({
        success: false,
        message: "Instructor ID is required",
      });
    }

    // Find courses that are rejected for this specific instructor
    const rejectedCourses = await Course.find({
      instructorId: instructorId,
      approvalStatus: "rejected",
    }).select("title category image rejectionReason date approvalStatus");

    res.status(200).json({
      success: true,
      data: rejectedCourses,
    });
  } catch (error) {
    console.error("Get Rejected Courses Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


module.exports = {
  addNewCourse,
  getAllCourses,
  updateCourseByID,
  getCourseDetailsByID,
  saveFinalQuiz,
  deleteCourse,
  getInstructorCourses,
  getInstructorStats,
  getEnrolledStudents,
  getRejectedCourses
};

const Course = require("../model/Course");
const StudentCourses = require("../model/StudentCourses");
const CourseProgress = require("../model/CourseProgress");
const mongoose = require("mongoose");

exports.getAllCourses = async (req, res) => {
  try {
    const {
      category = "",
      level = "",
      primaryLanguage = "",
      sortBy = "price-lowtohigh",
      limit = null,
      search = "",
    } = req.query;

    // 1. BASE FILTER: Strictly limit to Published & Approved courses
    let filters = {
      isPublished: true,
      approvalStatus: "approved",
    };

    // 2. Apply Dynamic Filters
    if (category) {
      filters.category = { $in: category.split(",") };
    }
    if (level) {
      filters.level = { $in: level.split(",") };
    }
    if (primaryLanguage) {
      filters.primaryLanguage = { $in: primaryLanguage.split(",") };
    }

    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: "i" } },
        { instructorName: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let sortParam = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sortParam.pricing = 1;
        break;
      case "price-hightolow":
        sortParam.pricing = -1;
        break;
      case "title-atoz":
        sortParam.title = 1;
        break;
      case "title-ztoa":
        sortParam.title = -1;
        break;
      default:
        sortParam.pricing = 1;
        break;
    }

    let coursesQuery = Course.find(filters).sort(sortParam);

    if (limit) {
      coursesQuery = coursesQuery.limit(parseInt(limit));
    }

    const courses = await coursesQuery;

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

exports.getCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const courseDetails = await Course.findById(id);

    // 1. CHECK: Course must exist AND be approved
    // If it exists but is pending/rejected, we treat it as "Not Found" for students
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // 2. SECURITY: Prevent direct URL access to unapproved courses
    if (
      courseDetails.approvalStatus !== "approved" ||
      !courseDetails.isPublished
    ) {
      return res.status(404).json({
        success: false,
        message: "Course is not available",
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
      message: "Something went wrong",
    });
  }
};

exports.checkCoursePurchaseInfo = async (req, res) => {
  try {
    const { id, studentId } = req.params;

    if (!studentId) {
      return res.status(200).json({
        success: true,
        data: false,
      });
    }

    const studentCourses = await StudentCourses.findOne({
      userId: studentId,
    });

    if (!studentCourses || !Array.isArray(studentCourses.courses)) {
      return res.status(200).json({
        success: true,
        data: false,
      });
    }

    const alreadyBought = studentCourses.courses.some(
      (item) => item.courseId.toString() === id,
    );

    res.status(200).json({
      success: true,
      data: alreadyBought,
    });
  } catch (e) {
    console.error("checkCoursePurchaseInfo error:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};


exports.getStudentStats = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
      });
    }

    // 1. Purchased courses
    const studentCoursesDoc = await StudentCourses.findOne({ userId: studentId });
    const purchasedCourses = studentCoursesDoc?.courses || [];

    const purchasedCourseIds = purchasedCourses.map(c => c.courseId);

    // 2. Progress docs
    const progressDocs = await CourseProgress.find({
      userId: studentId,
      courseId: { $in: purchasedCourseIds },
    });

    // 3. Fetch real course data (for lecture counts)
    const courses = await Course.find({
      _id: { $in: purchasedCourseIds },
    });

    const courseMap = {};
    courses.forEach(c => {
      courseMap[c._id.toString()] = c;
    });

    // 4. Stats
    const totalPurchased = purchasedCourses.length;
    const totalCompleted = progressDocs.filter(p => p.completed).length;
    const totalInProgress = totalPurchased - totalCompleted;

    const totalCertificates = progressDocs.filter(
      p => p.certificateProgress?.isIssued
    ).length;

    // 5. Continue Learning
    const continueLearning = progressDocs
      .filter(p => !p.completed)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 3)
      .map(p => {
        const course = courseMap[p.courseId.toString()];
        const totalLectures = course?.lectures?.length || 0;
        const viewedLectures = p.lecturesProgress.filter(l => l.viewed).length;

        const progressValue = totalLectures
          ? Math.round((viewedLectures / totalLectures) * 100)
          : 0;

        return {
          courseId: p.courseId,
          title: course?.title || "Unknown Course",
          image: course?.courseImage || "",
          instructor: course?.instructorName || "",
          progressValue,
        };
      });

    // 6. Recent Certificates
    const recentCertificates = progressDocs
      .filter(p => p.certificateProgress?.isIssued)
      .sort((a, b) => 
        new Date(b.certificateProgress.issueDate) -
        new Date(a.certificateProgress.issueDate)
      )
      .slice(0, 3)
      .map(p => {
        const course = courseMap[p.courseId.toString()];
        return {
          courseId: p.courseId,
          title: course?.title || "Course Certificate",
          issuedDate: p.certificateProgress.issueDate,
          certificateId: p.certificateProgress.certificateId,
        };
      });

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalPurchased,
          totalInProgress,
          totalCompleted,
          totalCertificates,
        },
        continueLearning,
        recentCertificates,
      },
    });
  } catch (e) {
    console.error("getStudentStats error:", e);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

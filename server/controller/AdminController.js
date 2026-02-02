const User = require("../model/User");
const Course = require("../model/Course");
const Report = require("../model/Contact");

exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalCourses,
      totalStudents,
      totalInstructors,
      totalReports,
      pendingCourses,
    ] = await Promise.all([
      Course.countDocuments({}),

      User.countDocuments({ role: "user" }),

      User.countDocuments({ role: "instructor" }),

      Report.countDocuments({}),

      Course.countDocuments({ approvalStatus: "pending" }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalCourses,
        totalStudents,
        totalInstructors,
        totalReports,
        pendingCourses,
        totalUsers: totalStudents + totalInstructors,
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch dashboard statistics.",
    });
  }
};

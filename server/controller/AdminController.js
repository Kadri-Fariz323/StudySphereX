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

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {
      // 1. Exclude 'admin' role
      role: { $ne: 'admin' }, 
      
      // 2. AND match name OR email
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const users = await User.find(query)
      .select("name email role status createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const totalUsers = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        totalUsers,
        currentPage: Number(page), // Ensure this is a number
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.toggleUserBlockStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.status = user.status === "active" ? "blocked" : "active";
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.status === "active" ? "unblocked" : "blocked"} successfully`,
      data: { status: user.status },
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

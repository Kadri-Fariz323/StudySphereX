const User = require("../model/User");
const Course = require("../model/Course");
const Contact = require("../model/Contact");

exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalCourses,
      totalStudents,
      totalInstructors,
      totalContacts, 
      pendingCourses,
      recentCourses,
      recentUsers,
      recentContacts
    ] = await Promise.all([
      Course.countDocuments({}),
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'instructor' }),
      Contact.countDocuments({}), // Counting from Contact model
      Course.countDocuments({ approvalStatus: 'pending' }),

      // Log queries
      Course.find().select('title instructorName date image approvalStatus').sort({ date: -1 }).limit(5),
      User.find({ role: { $ne: 'admin' } }).select('name email role createdAt image').sort({ createdAt: -1 }).limit(5),
      Contact.find().select('name email message createdAt status').sort({ createdAt: -1 }).limit(5)
    ]);

    return res.status(200).json({
      success: true,
      data: {
        counts: {
          totalCourses,
          totalStudents,
          totalInstructors,
          totalContacts,
          pendingCourses,
          totalUsers: totalStudents + totalInstructors 
        },
        logs: {
          recentCourses,
          recentUsers,
          recentContacts
        }
      }
    });

  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {
      role: { $ne: "admin" },

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
        currentPage: Number(page),
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

exports.getAllContacts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const contacts = await Contact.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const totalContacts = await Contact.countDocuments(query);

    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        totalContacts,
        currentPage: Number(page),
        totalPages: Math.ceil(totalContacts / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status: status },
      { new: true },
    );

    if (!contact) {
      return res
        .status(404)
        .json({ success: false, message: "Contact not found" });
    }

    res.status(200).json({
      success: true,
      data: contact,
      message: `Status updated to ${status}`,
    });
  } catch (error) {
    console.error("Error updating contact status:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { instructorName: { $regex: search, $options: "i" } },
      ],
    };

    const courses = await Course.find(query)
      .select(
        "title instructorName date pricing approvalStatus isPublished students image category",
      )
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ date: -1 });

    const totalCourses = await Course.countDocuments(query);

    res.status(200).json({
      success: true,
      data: courses,
      pagination: {
        totalCourses,
        currentPage: Number(page),
        totalPages: Math.ceil(totalCourses / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.updateCourseApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    const adminId = req.user ? req.user.id : null;

    let updateData = {};

    if (action === "approve") {
      updateData = {
        approvalStatus: "approved",
        isPublished: true,
        approvedBy: adminId,
      };
    } else if (action === "reject") {
      updateData = {
        approvalStatus: "rejected",
        isPublished: false,
        approvedBy: adminId,
      };
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid action" });
    }

    const course = await Course.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    res.status(200).json({
      success: true,
      message: `Course ${action}d successfully`,
      data: course,
    });
  } catch (error) {
    console.error("Error updating course status:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

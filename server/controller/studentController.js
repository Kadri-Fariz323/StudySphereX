const Course = require("../model/Course");
const StudentCourses = require("../model/StudentCourses");

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

    let filters = {};

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

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
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

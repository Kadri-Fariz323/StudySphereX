const StudentCourses = require("../model/StudentCourses");

exports.getCoursesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    const studentBoughtCourses = await StudentCourses.findOne({
      userId: studentId,
    });

    
    
    if (!studentBoughtCourses) {
      return res.status(200).json({
        success: true,
        data: [], 
      });
    }
    

    res.status(200).json({
      success: true,
      data: studentBoughtCourses.courses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};
const CourseProgress = require("../model/CourseProgress");
const Course = require("../model/Course");
const StudentCourses = require("../model/StudentCourses");

const markCurrentLectureAsViewed = async (req, res) => {
  try {
    const { userId, courseId, lectureId } = req.body;

    let progress = await CourseProgress.findOne({ userId, courseId });
    if (!progress) {
      progress = new CourseProgress({
        userId,
        courseId,
        lecturesProgress: [
          {
            lectureId,
            viewed: true,
            dateViewed: new Date(),
          },
        ],
      });
      await progress.save();
    } else {
      const lectureProgress = progress.lecturesProgress.find(
        (item) => item.lectureId === lectureId,
      );

      if (lectureProgress) {
        lectureProgress.viewed = true;
        lectureProgress.dateViewed = new Date();
      } else {
        progress.lecturesProgress.push({
          lectureId,
          viewed: true,
          dateViewed: new Date(),
        });
      }
      await progress.save();
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const hasQuiz =
      course.finalQuiz &&
      Array.isArray(course.finalQuiz.questions) &&
      course.finalQuiz.questions.length > 0;

    const allLecturesViewed =
      progress.lecturesProgress.length === course.curriculum.length &&
      progress.lecturesProgress.every((item) => item.viewed);

    if (allLecturesViewed && !hasQuiz) {
      progress.completed = true;
      progress.completionDate = new Date();
      await progress.save();
    }

    res.status(200).json({
      success: true,
      message: "Lecture marked as viewed",
      data: progress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const studentPurchasedCourses = await StudentCourses.findOne({ userId });

    const isCurrentCoursePurchasedByCurrentUserOrNot =
      studentPurchasedCourses?.courses?.findIndex(
        (item) => item.courseId === courseId,
      ) > -1;

    if (!isCurrentCoursePurchasedByCurrentUserOrNot) {
      return res.status(200).json({
        success: true,
        data: {
          isPurchased: false,
        },
        message: "You need to purchase this course to access it.",
      });
    }

    const currentUserCourseProgress = await CourseProgress.findOne({
      userId,
      courseId,
    });

    if (
      !currentUserCourseProgress ||
      currentUserCourseProgress?.lecturesProgress?.length === 0
    ) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "No progress found, you can start watching the course",
        data: {
          courseDetails: course,
          progress: [],
          isPurchased: true,
        },
      });
    }

    const courseDetails = await Course.findById(courseId);

    res.status(200).json({
      success: true,
      data: {
        courseDetails,
        progress: currentUserCourseProgress.lecturesProgress,
        completed: currentUserCourseProgress.completed,
        completionDate: currentUserCourseProgress.completionDate,
        isPurchased: true,
        quizProgress: currentUserCourseProgress.quizProgress,
        certificateProgress: currentUserCourseProgress.certificateProgress,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const resetCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const progress = await CourseProgress.findOne({ userId, courseId });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress not found!",
      });
    }

    progress.lecturesProgress = [];
    progress.completed = false;
    progress.completionDate = null;

    await progress.save();

    res.status(200).json({
      success: true,
      message: "Course progress has been reset",
      data: progress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { userId, courseId, quizId, answers } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const quizQuestions = course.finalQuiz.questions;
    const passingMarks = course.finalQuiz.passingMarks || 70;
    let correctCount = 0;

    answers.forEach((userAnswer) => {
      const question = quizQuestions.find(
        (q) => q._id.toString() === userAnswer.questionId,
      );

      if (
        question &&
        question.correctAnswerIndex === userAnswer.selectedOption
      ) {
        correctCount++;
      }
    });

    const score = (correctCount / quizQuestions.length) * 100;
    const passed = score >= passingMarks;

    let progress = await CourseProgress.findOne({ userId, courseId });
    if (!progress) {
      progress = new CourseProgress({ userId, courseId });
    }

    progress.quizProgress = {
      quizId,
      score,
      passed,
      attemptedDate: new Date(),
    };

    const lecturesCompleted =
      progress.lecturesProgress?.length === course.curriculum.length &&
      progress.lecturesProgress.every((l) => l.viewed);

    if (passed && lecturesCompleted) {
      progress.completed = true;
      progress.completionDate = new Date();
    }

    await progress.save();

    res.status(200).json({
      success: true,
      message: passed ? "Quiz Passed!" : "Quiz Failed. Try again.",
      data: {
        score,
        passed,
        passingMarks,
        quizProgress: progress.quizProgress,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const unlockCertificate = async (req, res) => {
  try {
    const { userId, courseId, certificateId } = req.body;

    const progress = await CourseProgress.findOne({ userId, courseId });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Course progress not found.",
      });
    }

    if (!progress.quizProgress?.passed) {
      return res.status(403).json({
        success: false,
        message: "You must pass the final quiz to unlock the certificate.",
      });
    }

    progress.certificateProgress = {
      certificateId,
      isIssued: true,
      issueDate: new Date(),
    };

    await progress.save();

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course data not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Certificate Unlocked Successfully!",
      data: {
        certificateId: certificateId,

        courseTitle: course.title,
        instructorName: course.instructorName,
        issueDate: progress.certificateProgress.issueDate,
        studentId: userId,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllCompletedCertificates = async (req, res) => {
  try {
    const { userId } = req.params;

    const completedCourses = await CourseProgress.find({
      userId,
      "certificateProgress.isIssued": true,
    });

    if (!completedCourses || completedCourses.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No certificates found",
        data: [],
      });
    }

    const courseIds = completedCourses.map((item) => item.courseId);

    const coursesDetails = await Course.find({ _id: { $in: courseIds } });

    const certificates = completedCourses.map((progress) => {
      const course = coursesDetails.find(
        (c) => c._id.toString() === progress.courseId.toString(),
      );

      return {
        certificateId: progress.certificateProgress.certificateId,
        issueDate: progress.certificateProgress.issueDate,
        courseTitle: course ? course.title : "Unknown Course",
        instructorName: course ? course.instructorName : "Unknown Instructor",
        courseId: progress.courseId,
        studentId: userId,
      };
    });

    res.status(200).json({
      success: true,
      message: "Certificates fetched successfully",
      data: certificates,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  getCurrentCourseProgress,
  resetCurrentCourseProgress,
  markCurrentLectureAsViewed,
  submitQuiz,
  unlockCertificate,
  getAllCompletedCertificates,
};

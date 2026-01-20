const mongoose = require("mongoose");


const LectureProgressSchema = new mongoose.Schema({
  lectureId: String,
  viewed: { type: Boolean, default: false },
  dateViewed: Date,
});


const QuizProgressSchema = new mongoose.Schema({
  quizId: String,
  score: Number,
  passed: { type: Boolean, default: false }, 
  attemptedDate: Date,
});


const CertificateProgressSchema = new mongoose.Schema({
  certificateId: String, 
  isIssued: { type: Boolean, default: false },
  issueDate: Date,
});

const CourseProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  courseId: { type: String, required: true },
  
  
  completed: { type: Boolean, default: false },
  completionDate: Date,

  
  lecturesProgress: [LectureProgressSchema],

  
  quizProgress: QuizProgressSchema,

  
  certificateProgress: CertificateProgressSchema,
});

module.exports = mongoose.model("StudentCoursesProgress", CourseProgressSchema);
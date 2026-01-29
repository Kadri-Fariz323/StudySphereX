const mongoose = require("mongoose");

// 1. Define QuizSchema
const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [
    {
      question: { type: String, required: true },
      options: [String],
      correctAnswerIndex: { type: Number, required: true },
    },
  ],
  passingMarks: { type: Number, default: 70 },
});

// 2.  LectureSchema
const LectureSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  public_id: String,
  freePreview: Boolean,
  pdfUrl: String,
  pdfPublicId: String,
  quiz: QuizSchema,
});

// 3. Define CourseSchema
const CourseSchema = new mongoose.Schema({
  instructorId: String,
  instructorName: String,
  date: Date,
  title: String,
  category: String,
  level: String,
  primaryLanguage: String,
  subtitle: String,
  description: String,
  image: String,
  welcomeMessage: String,
  pricing: Number,
  objectives: String,
  students: [
    {
      studentId: String,
      studentName: String,
      studentEmail: String,
      paidAmount: String,
    },
  ],
  curriculum: [LectureSchema],

  isPublished: Boolean,

  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  finalQuiz: {
    type: QuizSchema,
    default: null,
  },
});

module.exports = mongoose.model("Course", CourseSchema);

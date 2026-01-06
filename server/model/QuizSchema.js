const mongoose = require('mongoose');

// 1. Define the Quiz Schema
const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [
    {
      question: { type: String, required: true },
      options: [String], // Array of strings for options
      correctAnswerIndex: { type: Number, required: true },
    },
  ],
});

// 2. Update your Curriculum Schema
const CurriculumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String },
  public_id: { type: String },
  freePreview: { type: Boolean, default: false },
  
  // PDF fields
  pdfUrl: { type: String },
  pdfPublicId: { type: String },
  
  // Embed the Quiz Schema here. 
  // Default is null so not every lecture forces a quiz.
  quiz: { 
    type: QuizSchema, 
    default: null 
  }
});

const CourseSchema = new mongoose.Schema({
  courseTitle: { type: String, required: true },
  // ... other course fields ...
  curriculum: [CurriculumSchema], // Array of curriculum items
});

module.exports = mongoose.model('Course', CourseSchema);
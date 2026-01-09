// import React, { useState } from "react";
// import { Plus, Trash2, Save, RefreshCw, CheckCircle, Circle } from "lucide-react";
// import { AddQuizInDB } from "../../services/index";
// import { toast } from "sonner"; 

// const emptyQuestionTemplate = {
//   question: "",
//   options: ["", "", "", ""],
//   correctAnswerIndex: 0,
// };

// export const AddQuiz = ({ 
//   courseId, // <--- FIXED: Receiving courseId as prop
//   existingQuizData, 
//   onSave,   // Function to close modal/refresh parent
//   onCancel 
// }) => {
  
//   const [quizData, setQuizData] = useState(
//     existingQuizData || {
//       title: "",
//       passingMarks: 70, // <--- FIXED: Added default passing marks
//       questions: [structuredClone(emptyQuestionTemplate)],
//     }
//   );

//   const [isSaving, setIsSaving] = useState(false);

//   // --- Handlers ---

//   const handleQuizTitleChange = (e) => {
//     setQuizData({ ...quizData, title: e.target.value });
//   };

//   const handlePassingMarksChange = (e) => {
//     setQuizData({ ...quizData, passingMarks: Number(e.target.value) });
//   };

//   const handleAddQuestion = () => {
//     setQuizData({
//       ...quizData,
//       questions: [...quizData.questions, structuredClone(emptyQuestionTemplate)],
//     });
//   };

//   const handleDeleteQuestion = (index) => {
//     if (quizData.questions.length === 1) return;
//     const updatedQuestions = quizData.questions.filter((_, i) => i !== index);
//     setQuizData({ ...quizData, questions: updatedQuestions });
//   };

//   const handleQuestionTextChange = (index, value) => {
//     const updatedQuestions = [...quizData.questions];
//     updatedQuestions[index].question = value;
//     setQuizData({ ...quizData, questions: updatedQuestions });
//   };

//   const handleOptionChange = (qIndex, oIndex, value) => {
//     const updatedQuestions = [...quizData.questions];
//     updatedQuestions[qIndex].options[oIndex] = value;
//     setQuizData({ ...quizData, questions: updatedQuestions });
//   };

//   const handleCorrectAnswerChange = (qIndex, oIndex) => {
//     const updatedQuestions = [...quizData.questions];
//     updatedQuestions[qIndex].correctAnswerIndex = oIndex;
//     setQuizData({ ...quizData, questions: updatedQuestions });
//   };

//   const handleReset = () => {
//     if (window.confirm("Are you sure? This will clear all current quiz progress.")) {
//       setQuizData({
//         title: "",
//         passingMarks: 70,
//         questions: [structuredClone(emptyQuestionTemplate)],
//       });
//     }
//   };

//   const handleSaveQuiz = async () => {
//     // 1. Validation
//     if (!quizData.title.trim()) return toast.error("Please add a Quiz Title");
//     if (quizData.questions.some(q => !q.question.trim())) return toast.error("All questions must have text");
    
//     // 2. Integration
//     setIsSaving(true);
//     try {
//       // Structure matches backend: req.body.quizData
//       const response = await AddQuizInDB(courseId, { quizData }); 

//       if (response?.success) {
//         toast.success("Quiz saved successfully!");
//         if (onSave) onSave(); 
//       } else {
//         toast.error("Failed to save quiz.");
//       }
//     } catch (error) {
//       console.error("Error saving quiz:", error);
//       toast.error("An error occurred while saving.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 w-full max-w-4xl mx-auto font-sans">
      
//       {/* --- Header Section --- */}
//       <div className="mb-8 border-b border-gray-100 pb-6">
//         <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Final Assessment</h2>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Title Input */}
//           <div className="flex flex-col gap-2">
//             <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
//               Quiz Title
//             </label>
//             <input
//               type="text"
//               placeholder="Ex: End of Course Final Exam"
//               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
//               value={quizData.title}
//               onChange={handleQuizTitleChange}
//             />
//           </div>

//           {/* Passing Marks Input */}
//           <div className="flex flex-col gap-2">
//             <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
//               Passing Marks (%)
//             </label>
//             <div className="flex items-center gap-4">
//               <input
//                 type="range"
//                 min="0"
//                 max="100"
//                 step="5"
//                 className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
//                 value={quizData.passingMarks}
//                 onChange={handlePassingMarksChange}
//               />
//               <span className="text-lg font-bold text-indigo-600 min-w-[3ch]">
//                 {quizData.passingMarks}%
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* --- Questions List --- */}
//       <div className="space-y-8">
//         {quizData.questions.map((question, qIndex) => (
//           <div 
//             key={qIndex} 
//             className="bg-slate-50 p-6 rounded-lg border border-slate-200 relative group transition-all hover:border-indigo-300"
//           >
//             <div className="flex justify-between items-center mb-4">
//               <span className="text-indigo-600 font-bold text-lg">
//                 Question {qIndex + 1}
//               </span>
//               {quizData.questions.length > 1 && (
//                 <button
//                   onClick={() => handleDeleteQuestion(qIndex)}
//                   className="text-gray-400 hover:text-red-500 transition-colors p-2"
//                   title="Delete Question"
//                 >
//                   <Trash2 size={20} />
//                 </button>
//               )}
//             </div>

//             <div className="mb-6">
//               <input
//                 type="text"
//                 placeholder="Enter your question here..."
//                 className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 value={question.question}
//                 onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {question.options.map((option, oIndex) => {
//                 const isCorrect = question.correctAnswerIndex === oIndex;
//                 return (
//                   <div 
//                     key={oIndex} 
//                     className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
//                       isCorrect 
//                         ? "bg-indigo-50 border-indigo-200" 
//                         : "bg-white border-gray-200"
//                     }`}
//                   >
//                     <button
//                       onClick={() => handleCorrectAnswerChange(qIndex, oIndex)}
//                       className={`flex-shrink-0 focus:outline-none ${
//                         isCorrect ? "text-indigo-600" : "text-gray-300 hover:text-indigo-400"
//                       }`}
//                     >
//                       {isCorrect ? (
//                         <CheckCircle size={24} className="fill-indigo-600 text-white" />
//                       ) : (
//                         <Circle size={24} />
//                       )}
//                     </button>

//                     <input
//                       type="text"
//                       placeholder={`Option ${oIndex + 1}`}
//                       className="w-full bg-transparent border-none focus:ring-0 text-gray-700 placeholder-gray-400 focus:outline-none"
//                       value={option}
//                       onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
//                     />
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* --- Footer --- */}
//       <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between gap-4">
//         <button
//           onClick={handleAddQuestion}
//           className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 hover:border-indigo-500 transition-all"
//         >
//           <Plus size={20} /> Add Another Question
//         </button>

//         <div className="flex gap-3 justify-end">
//           <button
//             onClick={handleReset}
//             className="flex items-center gap-2 px-5 py-3 text-gray-600 font-medium hover:text-red-500 transition-colors"
//           >
//             <RefreshCw size={18} /> Reset
//           </button>
          
//           <button
//             onClick={handleSaveQuiz}
//             disabled={isSaving}
//             className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-lg font-bold shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isSaving ? "Saving..." : <><Save size={20} /> Save Final Quiz</>}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
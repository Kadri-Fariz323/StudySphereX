import React, { useState } from "react";
import { Plus, Trash2, Save, RefreshCw, CheckCircle, Circle, X } from "lucide-react";
import { toast } from "sonner"; 

const emptyQuestionTemplate = {
  question: "",
  options: ["", "", "", ""],
  correctAnswerIndex: 0,
};

export const AddQuiz = ({ 
  existingQuizData, 
  onSave,   // Now expects: (data) => void
  onCancel  // Now expects: () => void
}) => {
  
  // Initialize with existing data if editing, or fresh template
  const [quizData, setQuizData] = useState(
    existingQuizData || {
      title: "",
      passingMarks: 70, 
      questions: [structuredClone(emptyQuestionTemplate)],
    }
  );

  // Handlers (Same as before)
  const handleQuizTitleChange = (e) => setQuizData({ ...quizData, title: e.target.value });
  const handlePassingMarksChange = (e) => setQuizData({ ...quizData, passingMarks: Number(e.target.value) });
  
  const handleAddQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, structuredClone(emptyQuestionTemplate)],
    });
  };

  const handleDeleteQuestion = (index) => {
    if (quizData.questions.length === 1) return;
    const updatedQuestions = quizData.questions.filter((_, i) => i !== index);
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleQuestionTextChange = (index, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[index].question = value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleCorrectAnswerChange = (qIndex, oIndex) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[qIndex].correctAnswerIndex = oIndex;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleSaveInternal = () => {
    // 1. Validation
    if (!quizData.title.trim()) return toast.error("Please add a Quiz Title");
    if (quizData.questions.some(q => !q.question.trim())) return toast.error("All questions must have text");

    // 2. Return Data to Parent instead of DB
    onSave(quizData);
  };

  return (
    <div className="bg-white rounded-xl h-full flex flex-col font-sans">
       {/* Header with Cancel Button */}
       <div className="mb-6 border-b border-gray-100 pb-4 flex justify-between items-start">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Add Quiz to Lecture</h2>
           <p className="text-sm text-gray-500">Attach a quiz to this specific video curriculum.</p>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X size={24} className="text-gray-500" />
        </button>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {/* Title & Marks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Quiz Title</label>
              <input
                type="text"
                placeholder="Ex: Pop Quiz 1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={quizData.title}
                onChange={handleQuizTitleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
               <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Passing Marks ({quizData.passingMarks}%)</label>
               <input type="range" min="0" max="100" step="10" className="w-full h-2 bg-gray-200 rounded-lg accent-indigo-600 cursor-pointer mt-3" 
                 value={quizData.passingMarks} onChange={handlePassingMarksChange} />
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {quizData.questions.map((question, qIndex) => (
              <div key={qIndex} className="bg-slate-50 p-5 rounded-lg border border-slate-200 hover:border-indigo-300 transition-all">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-indigo-600 font-bold">Question {qIndex + 1}</span>
                  {quizData.questions.length > 1 && (
                    <button onClick={() => handleDeleteQuestion(qIndex)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                  )}
                </div>
                <input type="text" placeholder="Question text..." className="w-full p-3 mb-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={question.question} onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {question.options.map((option, oIndex) => {
                     const isCorrect = question.correctAnswerIndex === oIndex;
                     return (
                       <div key={oIndex} className={`flex items-center gap-2 p-2 rounded border ${isCorrect ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-200'}`}>
                          <button onClick={() => handleCorrectAnswerChange(qIndex, oIndex)} className={isCorrect ? "text-indigo-600" : "text-gray-300"}>
                            {isCorrect ? <CheckCircle size={20} className="fill-indigo-600 text-white"/> : <Circle size={20}/>}
                          </button>
                          <input type="text" placeholder={`Option ${oIndex + 1}`} className="w-full bg-transparent border-none focus:ring-0 text-sm"
                            value={option} onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} />
                       </div>
                     )
                  })}
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleAddQuestion} className="mt-6 flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:underline">
            <Plus size={16} /> Add New Question
          </button>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
        <button onClick={onCancel} className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">Cancel</button>
        <button onClick={handleSaveInternal} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold shadow hover:bg-indigo-700 transition-all">
          Save Quiz to Lecture
        </button>
      </div>
    </div>
  );
};
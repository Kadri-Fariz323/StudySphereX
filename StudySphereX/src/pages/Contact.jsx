
import { saveContactForm } from "@/services";
import { useState, useRef } from "react";

import contact from "../assets/contactUs.jpg"

export const Contact = () => {
  // State for form fields
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  
  // State for UI status
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  const Form = useRef();

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Clear error message when user starts typing again
    if (feedback.type === "error") setFeedback({ type: "", text: "" });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: "", text: "" });

    try {
      // 1. Call the API
      await saveContactForm(form);

      // 2. Handle Success
      setFeedback({ 
        type: "success", 
        text: "Message sent successfully! We'll get back to you soon." 
      });
      
      // 3. Reset Form
      setForm({ name: "", email: "", message: "" });
      
      // Optional: Clear success message after 5 seconds
      setTimeout(() => setFeedback({ type: "", text: "" }), 5000);

    } catch (error) {
      // 4. Handle Errors
      console.error("Submission Error:", error);

      // logic to extract the specific error message from the backend response
      let errorMsg = "Something went wrong. Please try again.";
      
      if (error.response && error.response.data) {
        if (Array.isArray(error.response.data.error)) {
          // If backend returns array of validation errors, show the first one
          errorMsg = error.response.data.error[0]; 
        } else if (error.response.data.error) {
          // If backend returns a single string error
          errorMsg = error.response.data.error;
        }
      }

      setFeedback({ type: "error", text: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-lg shadow-lg flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Section - Illustration */}
        <div className="relative md:w-1/2 bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center p-8">
          {/* Subtle background shapes */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-blue-300 opacity-20 rounded-full -translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-300 opacity-20 rounded-full translate-x-16 translate-y-16"></div>

          <div className="relative z-10 text-center">
            {/* Placeholder for image if variable is undefined */}
            <img
              src={contact}
              alt="Contact us illustration"
              className="max-w-full h-auto mx-auto"
            />
          </div>
        </div>

        {/* Right Section - Contact Form */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center md:text-left">
            Contact us
          </h2>
          
          {/* Feedback Message Block */}
          {feedback.text && (
            <div
              className={`${
                feedback.type === "error"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-green-50 text-green-700 border-green-200"
              } border rounded-lg px-4 py-3 mb-6 text-sm font-medium transition-all duration-300`}
            >
              {feedback.text}
            </div>
          )}

          <form className="space-y-6" ref={Form} onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out placeholder-gray-500 text-gray-900 outline-none"
                value={form.name}
                onChange={handleChange}
                required // Basic client-side validation
              />
            </div>
            
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out placeholder-gray-500 text-gray-900 outline-none"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="sr-only">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Message"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out resize-none placeholder-gray-500 text-gray-900 outline-none"
                value={form.message}
                onChange={handleChange}
                required
                minLength={10}
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {submitting ? (
                 <>
                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Sending...
                 </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.96.96l5 1.429A1 1 0 0019 16.553l-7-14z" />
                  </svg>
                  Send message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
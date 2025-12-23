import { useState, useRef } from "react";
import contactUs from '../assets/contactUs.jpg'

export const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  const Form = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", text: "" });
    if (!form.name || !form.email || !form.message) {
      setFeedback({ type: "error", text: "Please fill in all fields." });
      return;
    }
    setSubmitting(true);
    try {
      
      setFeedback({
        type: "success",
        text: "Thanks! Your message has been sent.",
      });
      setForm({ name: "", email: "", message: "" });
    } catch {
      setFeedback({
        type: "error",
        text: "Failed to send. Please try again later.",
      });
    } finally {
      setSubmitting(false);
    }

    // emailjs.sendForm("service_dpboj2b", "template_z1uo7fi", Form.current, "dbXa0JS8Q-S-1ZBpL").then(() => {
    //   form.current.reset()
    // }, (error) => {
    //   alert("failed to send message", error.text)
    // })
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-lg shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Left Section - Illustration */}
        <div className="relative md:w-1/2 bg-linear-to-br from-blue-100 to-indigo-50 flex items-center justify-center p-8">
          {/* Subtle background shapes */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-blue-300 opacity-20 rounded-full -translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-300 opacity-20 rounded-full translate-x-16 translate-y-16"></div>

          <div className="relative z-10 text-center">
            {/* Replace with your actual illustration or an SVG */}
            <img
              src={contactUs}
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
          {feedback.text && (
            <div
              className={`${
                feedback.type === "error"
                  ? "bg-red-50 text-red-700"
                  : "bg-green-50 text-green-700"
              } border ${
                feedback.type === "error"
                  ? "border-red-200"
                  : "border-green-200"
              } rounded-lg px-4 py-3 mb-4`}
            >
              {feedback.text}
            </div>
          )}
          <form className="space-y-6" ref={Form} onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out placeholder-gray-500 text-gray-900"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out placeholder-gray-500 text-gray-900"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="message" className="sr-only">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Message"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out resize-none placeholder-gray-500 text-gray-900"
                value={form.message}
                onChange={handleChange}
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              disabled={submitting}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.96.96l5 1.429A1 1 0 0019 16.553l-7-14z" />
              </svg>
              {submitting ? "Sending..." : "Send message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

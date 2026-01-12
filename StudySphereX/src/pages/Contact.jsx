import { saveContactForm } from "@/services";
import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";

import contact from "../assets/contactUs.jpg";

export const Contact = () => {
  // Form state (single source of truth)
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  const formRef = useRef(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (feedback.type === "error") {
      setFeedback({ type: "", text: "" });
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: "", text: "" });

    try {
      // 1️⃣ Save to backend
      await saveContactForm(form);

      // 2️⃣ Send email via EmailJS
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: form.name,
          email: form.email,
          message: form.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      // 3️⃣ Success UI
      setFeedback({
        type: "success",
        text: "Message sent successfully! We'll get back to you soon.",
      });

      // 4️⃣ Reset form
      setForm({ name: "", email: "", message: "" });

      setTimeout(() => {
        setFeedback({ type: "", text: "" });
      }, 5000);
    } catch (error) {
      console.error("Submission Error:", error);

      let errorMsg = "Something went wrong. Please try again.";

      if (error?.response?.data?.error) {
        errorMsg = Array.isArray(error.response.data.error)
          ? error.response.data.error[0]
          : error.response.data.error;
      }

      setFeedback({ type: "error", text: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-lg shadow-lg flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Image */}
        <div className="relative md:w-1/2 bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center p-8">
          <img
            src={contact}
            alt="Contact us"
            className="max-w-full h-auto"
          />
        </div>

        {/* Right Form */}
        <div className="md:w-1/2 p-8 md:p-12">
          <h2 className="text-4xl font-bold mb-8">Contact us</h2>

          {feedback.text && (
            <div
              className={`mb-6 px-4 py-3 rounded-lg border text-sm font-medium ${
                feedback.type === "error"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-green-50 text-green-700 border-green-200"
              }`}
            >
              {feedback.text}
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border rounded-lg"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border rounded-lg"
            />

            <textarea
              name="message"
              placeholder="Message"
              rows="5"
              value={form.message}
              onChange={handleChange}
              required
              minLength={10}
              className="w-full px-5 py-3 border rounded-lg resize-none"
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-blue-600 text-white rounded-lg disabled:opacity-70"
            >
              {submitting ? "Sending..." : "Send message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

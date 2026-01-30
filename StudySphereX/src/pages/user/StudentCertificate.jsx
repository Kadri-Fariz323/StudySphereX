import { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom"; // Assuming you use React Router
import { AuthContext } from "@/context/AuthContext";
import { Loader2, AlertCircle, Download } from "lucide-react"; // Icons (optional)
import { unlockCertificateService } from "@/services/StudentViewService";
import logo from "../../assets/logo.png";

export const StudentCertificate = () => {
  const { auth } = useContext(AuthContext);
  const { id } = useParams();
  const courseId = id;
  const certificateRef = useRef(null);

  const [certificateData, setCertificateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        const response = await unlockCertificateService(
          auth.user._id,
          courseId,
        );

        console.log("2. API Response received:", response); // DEBUG

        if (response.success) {
          setCertificateData(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        console.error("3. API Error:", err); // DEBUG
        const msg =
          err.response?.data?.message || "Failed to load certificate.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    // Check if we have the data needed to run
    if (auth.user && courseId) {
      fetchCertificate();
    } else {
      console.log("Waiting for auth.user or courseId...", {
        auth: auth.user,
        courseId,
      });
    }
  }, [auth.user, courseId]);

  const handlePrint = () => {
    window.print();
  };

  // ---------------- Render: Loading State ----------------
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Generating Certificate...</span>
      </div>
    );
  }

  // ---------------- Render: Error/Not Eligible State ----------------
  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4">
        <div className="rounded-lg bg-red-50 p-6 text-center shadow-md">
          <AlertCircle className="mx-auto mb-2 h-10 w-10 text-red-500" />
          <h2 className="mb-2 text-xl font-bold text-red-700">
            Certificate Locked
          </h2>
          <p className="text-gray-700">{error}</p>
          <p className="mt-2 text-sm text-gray-500">
            Please ensure you have completed all course materials and passed the
            final quiz.
          </p>
        </div>
      </div>
    );
  }

  // ---------------- Render: Certificate UI ----------------
  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 py-10">
      {/* Action Buttons (Hidden when printing) */}
      <div className="mb-6 flex gap-4 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
        >
          <Download size={18} /> Download / Print
        </button>
      </div>

      {/* Actual Certificate Container */}
      <div
        ref={certificateRef}
        className="relative w-[800px] bg-white p-10 text-center shadow-2xl print:w-full print:shadow-none"
        style={{ border: "10px double #1f2937" }} // Double border for classic look
      >
        {/* Decorative Corner Borders (CSS or SVG) */}
        <div className="absolute top-4 left-4 h-16 w-16 border-t-4 border-l-4 border-yellow-500"></div>
        <div className="absolute top-4 right-4 h-16 w-16 border-t-4 border-r-4 border-yellow-500"></div>
        <div className="absolute bottom-4 left-4 h-16 w-16 border-b-4 border-l-4 border-yellow-500"></div>
        <div className="absolute bottom-4 right-4 h-16 w-16 border-b-4 border-r-4 border-yellow-500"></div>

        {/* Certificate Content */}
        <div className="py-10">
          <div className="mb-6 flex justify-center">
            <img src={logo} alt="Logo" className="w-34 h-auto object-contain" />
          </div>

          <h1 className="mb-2 text-4xl font-serif font-bold uppercase tracking-widest text-gray-800">
            Certificate
          </h1>
          <h2 className="mb-8 text-xl font-light uppercase tracking-widest text-gray-500">
            Of Completion
          </h2>

          <p className="text-lg text-gray-600">This is to certify that</p>

          <h3 className="my-4 text-3xl font-serif font-bold italic text-blue-900 border-b-2 border-gray-300 inline-block px-10 pb-2">
            {auth.user.name}
          </h3>

          <p className="mt-4 text-lg text-gray-600">
            has successfully completed the course
          </p>

          <h4 className="my-4 text-2xl font-bold text-gray-800">
            {certificateData?.courseTitle}
          </h4>

          <p className="mx-auto max-w-lg text-gray-500">
            Demonstrating dedication and proficiency in the subject matter as
            prescribed by the SkillSync curriculum.
          </p>
        </div>

        {/* Footer: Signatures and ID */}
        <div className="mt-12 flex items-end justify-between px-10">
          <div className="text-center">
            <div className="mb-2 font-signature text-2xl text-gray-800">
              {/* Simulating a signature font */}
              <span style={{ fontFamily: "'Dancing Script', cursive" }}>
                {certificateData?.instructorName}
              </span>
            </div>
            <div className="h-px w-48 bg-gray-400"></div>
            <p className="mt-2 text-sm font-bold text-gray-500">Instructor</p>
          </div>

          <div className="text-center">
            {/* Formatting the ISO date */}
            <div className="mb-2 text-lg text-gray-800">
              {new Date(certificateData?.issueDate).toLocaleDateString()}
            </div>
            <div className="h-px w-48 bg-gray-400"></div>
            <p className="mt-2 text-sm font-bold text-gray-500">Date Issued</p>
          </div>
        </div>

        {/* Certificate ID */}
        <div className="mt-10 text-xs text-gray-400">
          Certificate ID: {certificateData?.certificateId}
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page { size: landscape; margin: 0; }
          body { -webkit-print-color-adjust: exact; background: white; }
          .print\\:hidden { display: none !important; }
        }
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&display=swap');
      `}</style>
    </div>
  );
};

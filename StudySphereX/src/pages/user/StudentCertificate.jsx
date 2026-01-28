import { AuthContext } from "@/context/AuthContext";
import { unlockCertificateService } from "@/services/StudentViewService";
import { useContext, useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from '../../assets/logo.png'; // Ensure this path is correct
import { Loader2, Download } from "lucide-react"; // Optional: For icons
import { StudentContext } from "@/context/StudentContext";

export const StudentCertificate = ({ courseDetails }) => {
  const { auth } = useContext(AuthContext);
  const [certificateData, setCertificateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const certificateRef = useRef();

  const { currentCourseMeta } = useContext(StudentContext);

const courseTitle = currentCourseMeta?.title;
const instructorName = currentCourseMeta?.instructorName;
console.log(currentCourseMeta);


  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        if (auth?.user?._id && courseDetails?._id) {
          const response = await unlockCertificateService(
            auth.user._id,
            courseDetails._id
          );

          if (response?.success) {
            setCertificateData(response.data);
          } else {
            setError("Certificate not available yet. Please complete the course.");
          }
        }
      } catch (err) {
        console.error("Error fetching certificate:", err);
        setError("Failed to load certificate.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [auth, courseDetails]);

  const handleDownload = async () => {
    const element = certificateRef.current;
    const canvas = await html2canvas(element, {
      scale: 2, // Improves resolution
      useCORS: true, // Handles cross-origin images if necessary
      backgroundColor: "#ffffff"
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "mm", "a4"); // Landscape, millimeters, A4 size
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${auth?.user?.name || "Student"}_Certificate.pdf`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 text-red-600 rounded-lg border border-red-200">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* Certificate Container - This part gets printed */}
      <div
        ref={certificateRef}
        className="relative w-full max-w-4xl bg-white border-[10px] border-double border-gray-800 p-12 shadow-lg text-center aspect-[1.414/1] flex flex-col justify-between"
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <img src={logo} alt="Organization Logo" className="h-16 w-auto mb-2 opacity-90" />
          <h1 className="text-4xl font-serif font-bold text-gray-800 tracking-wider uppercase">
            Certificate of Completion
          </h1>
          <p className="text-gray-500 font-medium">This is to certify that</p>
        </div>

        {/* Student Name */}
        <div className="py-4">
          <h2 className="text-5xl font-script font-bold text-blue-900 mb-2 italic">
            {auth?.user?.name || "Student Name"}
          </h2>
          <div className="h-0.5 w-1/2 bg-gray-300 mx-auto my-4"></div>
          <p className="text-lg text-gray-600">
            Has successfully completed the course
          </p>
        </div>

        {/* Course Details */}
        <div>
          <h3 className="text-3xl font-bold text-gray-800 mb-2">
            {courseTitle  || "Course Title Here"}
          </h3>
          <p className="text-gray-500">
            Date Issued: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}
          </p>
        </div>

        {/* Footer / Signatures */}
        <div className="flex justify-between items-end mt-8 px-12">
          <div className="text-center">
          {instructorName}
            <div className="border-t border-gray-400 w-40 mb-1"></div>
            <p className="text-sm font-bold text-gray-600 uppercase tracking-widest">Instructor</p>
          </div>
          
          {/* Optional Seal */}
          <div className="opacity-80">
            <div className="w-24 h-24 border-4 border-blue-900 rounded-full flex items-center justify-center text-blue-900 font-bold rotate-[-15deg]">
              OFFICIAL
              <br />
              SEAL
            </div>
          </div>

          <div className="text-center">
              KF
            <div className="border-t border-gray-400 w-40 mb-1"></div>
            <p className="text-sm font-bold text-gray-600 uppercase tracking-widest">Director</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors font-semibold"
      >
        <Download className="h-5 w-5" />
        Download Certificate
      </button>
    </div>
  );
};
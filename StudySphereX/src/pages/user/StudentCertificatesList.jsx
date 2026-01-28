import { useEffect, useState, useContext } from "react";
import { Card } from "@/components/ui/card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Adjust based on your UI library exports
import { useNavigate } from "react-router-dom";
import { fetchStudentCertificatesService } from "@/services/StudentViewService";
import { AuthContext } from "@/context/AuthContext";

export const StudentCertificatesList = () => {
  const { auth } = useContext(AuthContext);
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetchStudentCertificatesService(auth?.user?._id);
        if (response?.success) {
          setCertificates(response.data);
        }
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (auth?.user?._id) fetchCertificates();
  }, [auth?.user?._id]);

  const handleNavigate = (courseId) => {
    navigate(`/course-certificate/${courseId}`);
  };

  if (isLoading) return <div className="p-10 text-center">Loading certificates...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
      {certificates.length > 0 ? (
        certificates.map((cert) => (
          <Card
            key={cert.certificateId}
            className="cursor-pointer hover:shadow-lg transition-all border-green-200 bg-green-50/20"
            onClick={() => handleNavigate(cert.courseId)}
          >
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-700">
                {/* Certificate Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <CardTitle className="text-lg font-bold">Certificate of Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-semibold mb-2 line-clamp-2">{cert.courseTitle}</h3>
              <p className="text-sm text-gray-500 mb-1">Instructor: {cert.instructorName}</p>
              <p className="text-xs text-gray-400">
                Issued on: {new Date(cert.issueDate).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="col-span-full text-center text-gray-500 mt-10">
          No certificates found. Complete a course to earn one!
        </div>
      )}
    </div>
  );
};
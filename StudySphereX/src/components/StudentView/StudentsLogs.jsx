import { PlayCircle, Award, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressLoading } from "../UI/ProgressLoading";
import { useNavigate } from "react-router-dom";

export const StudentsLogs = ({ continueLearning, recentCertificates, loading }) => {
    const navigate = useNavigate();
   const handleNavigate = (courseId) => {
    navigate(`/course-certificate/${courseId}`);
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Continue Learning Section */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <PlayCircle className="text-indigo-600" size={20} />
          <h2 className="font-bold text-lg text-gray-800">Continue Learning</h2>
        </div>

        <div className="space-y-8">
          {continueLearning?.length > 0 ? (
            continueLearning.map((course) => (
              <div key={course.courseId} className="group">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-gray-700 truncate max-w-[70%]">
                    {course.title}
                  </span>
                  <span className="text-xs text-indigo-500 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                    {course.instructor}
                  </span>
                </div>

                {/* Integration of your ProgressLoading Component */}
                <ProgressLoading 
                  isMediaUploading={loading || course.progressValue > 0} 
                  progress={course.progressValue} 
                />

                <div className="flex justify-end mt-[-10px]">
                   <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                    onClick={() => window.location.href = `/course-progress/${course.courseId}`}
                   >
                     Resume Course <ChevronRight size={14} className="ml-1" />
                   </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center border-2 border-dashed rounded-lg">
              <p className="text-sm text-gray-400">No active courses found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Certificates Section */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <Award className="text-pink-500" size={20} />
          <h2 className="font-bold text-lg text-gray-800">Recent Certificates</h2>
        </div>

        <div className="space-y-4">
          {recentCertificates?.length > 0 ? (
            recentCertificates.map((cert) => (
              <div 
                key={cert.courseId} 
                className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-pink-50 border border-indigo-100 rounded-lg group hover:shadow-md transition-all"
              >
                <div>
                  <h3 className="text-sm font-bold text-gray-800">{cert.title}</h3>
                  <p className="text-[10px] text-gray-500 font-medium uppercase mt-1">
                    Completed: {new Date(cert.issuedDate).toLocaleDateString()}
                  </p>
                </div>
                <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-sm cursor-pointer" onClick={() => handleNavigate(cert.courseId)}>
                  View Certificate
                </Button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
              <Award size={48} className="mb-2 text-gray-300" />
              <p className="text-sm text-gray-500">Earn your first certificate today!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
import React from "react";
import { User, BookOpen, Mail, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
export const ActivityLogs = ({ logs }) => {
 
  if (!logs) return null;

  const { recentCourses = [], recentUsers = [], recentContacts = [] } = logs;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      
      {/* LEFT COLUMN: Recent Courses & Users (Takes up 2/3 width) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Recent Courses Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" /> Newest Courses
          </h3>
          <div className="space-y-4">
            {recentCourses.length === 0 ? <p className="text-sm text-gray-500">No courses yet.</p> : 
              recentCourses.map((course) => (
                <div key={course._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-md overflow-hidden">
                       {/* Placeholder for image */}
                       {course.image ? <img src={course.image} className="w-full h-full object-cover"/> : <div className="w-full h-full bg-blue-100"/>}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{course.title}</p>
                      <p className="text-xs text-gray-500">by {course.instructorName}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border ${
                    course.approvalStatus === 'approved' ? 'bg-green-100 text-green-700 border-green-200' :
                    course.approvalStatus === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                    'bg-yellow-100 text-yellow-700 border-yellow-200'
                  }`}>
                    {course.approvalStatus}
                  </span>
                </div>
              ))
            }
          </div>
        </div>

        {/* Recent Users Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" /> New Registrations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {recentUsers.length === 0 ? <p className="text-sm text-gray-500">No users yet.</p> : 
               recentUsers.map((user) => (
                 <div key={user._id} className="flex items-center p-3 border border-gray-100 rounded-lg">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs mr-3">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                 </div>
               ))
             }
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Recent Messages (Takes up 1/3 width) */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5 text-red-500" /> Recent Inquiries
        </h3>
        <div className="space-y-4">
           {recentContacts.length === 0 ? <p className="text-sm text-gray-500">No messages yet.</p> : 
             recentContacts.map((contact) => (
               <div key={contact._id} className="group relative border-l-2 border-transparent hover:border-red-500 pl-3 transition-all">
                 <div className="flex justify-between items-start">
                   <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                   <span className="text-[10px] text-gray-400">
                     {new Date(contact.createdAt).toLocaleDateString()}
                   </span>
                 </div>
                 <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                   {contact.message}
                 </p>
                 <div className="mt-2 flex items-center justify-between">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${contact.status === 'new' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                      {contact.status}
                    </span>
                 </div>
               </div>
             ))
           }
        </div>
      </div>

    </div>
  );
};
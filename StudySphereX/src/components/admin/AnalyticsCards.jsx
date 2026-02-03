import { DashboardCard } from "@/components/UI/DashboardCard";
import { User, BookOpen, FileText, AlertCircle, Users, Shield } from "lucide-react"; 

export const AnalyticsCards = ({ stats }) => {
  
  const {
    totalUsers = 0,
    totalStudents = 0,
    totalInstructors = 0,
    totalCourses = 0,
    pendingCourses = 0,
    totalContacts = 0
  } = stats || {};

  return (
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">

       {/* 1. Total Users (Combined) */}
       <DashboardCard 
        title="Total Users" 
        value={totalUsers} 
        icon={<Users className="text-indigo-500" />} 
      />

      {/* 2. Students */}
      <DashboardCard 
        title="Total Students" 
        value={totalStudents} 
        icon={<User className="text-green-500" />} 
      />

      {/* 3. Instructors */}
      <DashboardCard 
        title="Total Instructors" 
        value={totalInstructors} 
        icon={<Shield className="text-purple-500"/>} 
      />

      {/* 4. Courses */}
      <DashboardCard 
        title="Total Courses" 
        value={totalCourses} 
        icon={<BookOpen className="text-blue-500" />} 
      />
      
      {/* 5. Pending Approvals */}
      <DashboardCard 
        title="Pending Approvals" 
        value={pendingCourses} 
        icon={<AlertCircle className="text-orange-500"/>} 
      />
      
      {/* 6. Mails / Contacts */}
      <DashboardCard 
        title="Support Mails" 
        value={totalContacts} 
        icon={<FileText className="text-red-500"/>} 
      />
    </div>
  );
};
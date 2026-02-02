import { DashboardCard } from "@/components/UI/DashboardCard";
import { User, BookOpen, FileText, AlertCircle } from "lucide-react"; 

export const AnalyticsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">

       <DashboardCard 
        title="Total Users" 
        value={stats.totalUsers} 
        icon={<User />} 
      />
      

      <DashboardCard 
        title="Total Courses" 
        value={stats.totalCourses} 
        icon={<BookOpen />} 
      />
      
      <DashboardCard 
        title="Total Students" 
        value={stats.totalStudents} 
        icon={<User />} 
      />

      
      <DashboardCard 
        title="Instructors" 
        value={stats.totalInstructors} 
        icon={<User className="text-blue-500"/>} 
      />
      
      <DashboardCard 
        title="Pending Approvals" 
        value={stats.pendingCourses} 
        icon={<AlertCircle className="text-orange-500"/>} 
      />
      
      <DashboardCard 
        title="Mails" 
        value={stats.totalContacts} 
        icon={<FileText className="text-red-500"/>} 
      />
    </div>
  );
};
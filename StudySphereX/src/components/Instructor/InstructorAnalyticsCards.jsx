import { User } from "lucide-react";
import { DashboardCard } from "../UI/DashboardCard";
import { MdApproval, MdDone, MdReport } from "react-icons/md";
import { VideoIcon } from "lucide-react";
import { FaBarsProgress } from "react-icons/fa6";
import { FaDollarSign } from "react-icons/fa";

export const InstructorAnalyticsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <DashboardCard
        title="Total Enrolled Students"
        value={stats.totalEnrolledStudents || 0}
        icon={<User />}
        color="blue"
      />

      <DashboardCard
        title="Total My Courses"
        value={stats.totalMyCourses || 0}
        icon={<VideoIcon />}
        color="green"
      />

      <DashboardCard
        title="Total Revenue"
        value={`$${stats.totalRevenue || 0}`}
        icon={<FaDollarSign />}
        color="yellow"
      />

      <DashboardCard
        title="Approved Courses"
        value={stats.totalApprovedCourses || 0}
        icon={<MdApproval />}
        color="purple"
      />

      <DashboardCard
        title="Pending Courses"
        value={stats.totalPendingCourses || 0}
        icon={<FaBarsProgress />}
        color="orange"
      />

      <DashboardCard
        title="Rejected Courses"
        value={stats.totalRejectedCourses || 0}
        icon={<MdReport />}
        color="red"
      />
    </div>
  );
};


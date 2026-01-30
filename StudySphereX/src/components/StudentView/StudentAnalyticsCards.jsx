import { User } from "lucide-react";
import { DashboardCard } from "../UI/DashboardCard";
import { Video } from "lucide-react";
import { MdApproval, MdDone, MdReport } from "react-icons/md";
import { Mails } from "lucide-react";
import { VideoIcon } from "lucide-react";
import { FaBarsProgress } from "react-icons/fa6";
import { FaCertificate } from "react-icons/fa";
import { PiCertificateBold } from "react-icons/pi";

export const StudentAnalyticsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <DashboardCard
        title="Total Purchased Courses"
        value={stats.totalPurchased || "No Courses"}
        icon={<VideoIcon />}
        color="blue"
      />

      <DashboardCard
        title="Courses In Progress"
        value={stats.totalInProgress || "None"}
        icon={<FaBarsProgress />}
        color="orange"
      />

      <DashboardCard
        title="Courses Completed"
        value={stats.totalCompleted || "None"}
        icon={<MdDone />}
        color="green"
      />

      <DashboardCard
        title="Certificates Earned"
        value={stats.totalCertificates || "None"}
        icon={<PiCertificateBold />}
        color="purple"
      />
    </div>
  );
};


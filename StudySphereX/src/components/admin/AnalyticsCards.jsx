import { User } from "lucide-react"
import { DashboardCard } from "./DashboardCard"
import { Video } from "lucide-react"
import { MdApproval, MdReport } from "react-icons/md"
import { Mails } from "lucide-react"

export const AnalyticsCards = () => {
  return (
    <div>
          {/* //cards */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <DashboardCard 
            title="Total Users"
            value="2"
            icon={<User />}
            />

             <DashboardCard 
            title="Total Instructors"
            value="2"
            icon={<User />}
            />

             <DashboardCard 
            title="Total Courses"
            value="2"
            icon={<Video />}
            />

             <DashboardCard 
            title="Pending Approvals"
            value="2"
            icon={<MdApproval />}
            />

             <DashboardCard 
            title="Reports"
            value="2"
            icon={<Mails />}
            />
           </div>
    </div>
  )
}

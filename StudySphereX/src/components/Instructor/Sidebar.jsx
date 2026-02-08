import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdEmail,
  MdClose,
} from "react-icons/md";
import { FaPhotoVideo } from "react-icons/fa";
import { MdQuiz } from "react-icons/md";
import logo from "../../assets/logo.png";

export const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navLinks = [
    { name: "Dashboard", icon: MdDashboard, path: "/instructor" },
    { name: "Add Course", icon: FaPhotoVideo, path: "/instructor/add-course" },
    { name: "My Courses", icon: FaPhotoVideo, path: "/instructor/my-courses" },
    { name: "Enrolled Students", icon: MdPeople, path: "/instructor/manage-users" },
    { name: "Course Reports", icon: MdPeople, path: "/instructor/view-reports"},


  ];

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 bg-white shadow-xl z-50 transform 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 transition-transform duration-300 ease-in-out
        w-64 shrink-0 border-r border-indigo-50
      `}
    >
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between p-4 border-b border-indigo-50 h-16">
        <img src={logo} alt="Logo" className="w-30 md:w-40 lg:w-40 h-auto" />
        
        {/* --- CLOSE BUTTON FOR MOBILE --- */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden text-gray-500 hover:text-indigo-600 transition-colors"
          aria-label="Close sidebar"
        >
          <MdClose size={24} />
        </button>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="p-4">
        <ul className="space-y-1">
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                end
                onClick={() => isSidebarOpen && setIsSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center p-3 rounded-lg transition-all duration-200 font-medium
                  ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <link.icon className={`mr-3 ${isActive ? "text-indigo-600" : ""}`} size={20} />
                    {link.name}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

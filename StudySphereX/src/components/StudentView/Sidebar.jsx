import { NavLink } from "react-router-dom";
import { MdDashboard, MdEmail, MdClose } from "react-icons/md";
import { FaPhotoVideo } from "react-icons/fa";
import { PiCertificateFill } from "react-icons/pi";
import { TiNews } from "react-icons/ti";
import logo from "../../assets/logo.png";

export const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navLinks = [
    { name: "Dashboard", icon: MdDashboard, path: "/user" },
    { name: "Explore Courses", icon: FaPhotoVideo, path: "/user/courses" },
    { name: "My Courses", icon: FaPhotoVideo, path: "/user/student-courses" },
    { name: "Certificates", icon: PiCertificateFill, path: "/user/certificates" },
    { name: "Discover", icon: TiNews, path: "/user/Discover" },


  ];

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 bg-white shadow-xl z-50 transform 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 transition-transform duration-300 ease-in-out
        w-64 shrink-0 border-r border-blue-50
      `}
    >
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between p-4 border-b border-blue-50 h-16">
        <img src={logo} alt="Logo" className="w-30 md:w-40 lg:w-40 h-auto" />

        {/* --- CLOSE BUTTON FOR MOBILE --- */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden text-gray-500 hover:text-blue-600 transition-colors"
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
                      ? "bg-blue-50 text-blue-600 shadow-sm"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <link.icon
                      className={`mr-3 ${isActive ? "text-blue-600" : ""}`}
                      size={20}
                    />
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

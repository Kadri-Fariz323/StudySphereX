import { FaBars } from "react-icons/fa";
import admin from "../../assets/Admin.jpg";
import { useContext } from "react";
import { AuthContext }from '../../context/AuthContext'

import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const Header = ({ setIsSidebarOpen }) => {

  const { auth } = useContext(AuthContext)
  const navigate = useNavigate();
  const {resetCredentials} = useContext(AuthContext) 

  const handleLogout = () => {
     resetCredentials()
      localStorage.clear()
      toast.success("Logout Successful")
  };


  return (
    <header className="w-full bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between sticky top-0 z-50">
      
      {/* LEFT SIDE: Toggle & Logo */}
      <div className="flex items-center gap-3 sm:gap-4">
        <FaBars
          className="text-xl sm:text-2xl text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          // Accessibility fixes for warnings
          role="button"
          tabIndex={0}
          aria-label="Toggle Sidebar"
        />
        <h1 className="text-lg sm:text-2xl font-bold text-gray-900 whitespace-nowrap">
          
        </h1>
      </div>

      {/* RIGHT SIDE: User Profile & Logout */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Hide 'Welcome' on mobile to save space for the button */}
        <span className="hidden md:block text-sm text-gray-500 font-medium">
          Welcome, {auth?.user?.name}
        </span>
        
        <img
        onClick={() => navigate('/instructor/profile')}
          src={admin}
          alt="Instructor Profile"
          className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover border border-gray-200 flex-shrink-0 cursor-pointer"
        />

        <button
          onClick={handleLogout}
          className="
            cursor-pointer font-bold transition-all 
            bg-blue-500 text-white rounded-lg 
            border-blue-600 
            
            text-xs px-3 py-1.5 border-b-[3px] 
            
            sm:text-sm sm:px-6 sm:py-2 sm:border-b-[4px]
            
            hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[4px] sm:hover:border-b-[6px]
            
            active:border-b-[1px] active:brightness-90 active:translate-y-[2px]
            
            flex-shrink-0
          "
        >
          Logout
        </button>
      </div>
    </header>
  );
};

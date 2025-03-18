import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const SponsorNavbar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userName, setUserName] = useState("Sponsor Portal");
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`bg-white text-gray-700 h-screen fixed top-0 left-0 z-10 transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"} border-r border-gray-100 shadow-sm`}>
      <div className="flex flex-col h-full">
        {/* Logo and Collapse Button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          {!isCollapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-blue-400 flex items-center justify-center text-white">
                {userName.charAt(0)}
              </div>
              <span className="ml-3 text-lg font-light">{userName}</span>
            </div>
          )}
          {isCollapsed && (
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-blue-400 flex items-center justify-center text-white mx-auto">
              {userName.charAt(0)}
            </div>
          )}
        </div>
        
        {/* Navigation Links */}
        <div className="flex flex-col py-6 space-y-1 overflow-y-auto flex-grow px-3">
          <Link 
            to="/sponsor/dashboard" 
            className={`px-4 py-3 rounded-lg flex items-center transition-all ${
              isActive("/sponsor/dashboard") 
                ? "bg-gradient-to-r from-teal-50 to-blue-50 text-blue-600 border-l-4 border-blue-400" 
                : "hover:bg-gray-50"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            {!isCollapsed && <span className="ml-3 font-light">Dashboard</span>}
          </Link>
          
          <Link 
            to="/sponsor/athletes" 
            className={`px-4 py-3 rounded-lg flex items-center transition-all ${
              isActive("/sponsor/athletes") 
                ? "bg-gradient-to-r from-teal-50 to-blue-50 text-blue-600 border-l-4 border-blue-400" 
                : "hover:bg-gray-50"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            {!isCollapsed && <span className="ml-3 font-light">Athletes</span>}
          </Link>
          
          <Link 
            to="/sponsor/requests" 
            className={`px-4 py-3 rounded-lg flex items-center transition-all ${
              isActive("/sponsor/requests") 
                ? "bg-gradient-to-r from-teal-50 to-blue-50 text-blue-600 border-l-4 border-blue-400" 
                : "hover:bg-gray-50"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clipRule="evenodd" />
            </svg>
            {!isCollapsed && <span className="ml-3 font-light">Requests</span>}
          </Link>
        </div>
        
        {/* Logout Button */}
        <div className="mt-auto p-4">
          <Link 
            to="/login" 
            className={`px-4 py-3 rounded-lg flex items-center transition-all text-red-500 hover:bg-red-50 hover:text-red-600 ${isCollapsed ? "justify-center" : ""}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            {!isCollapsed && <span className="ml-3 font-light">Log out</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default SponsorNavbar;
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Trophy, 
  FileText, 
  DollarSign,
  User,
  LogOut, 
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const AthleteNavbar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Check if current path matches the link
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { 
      path: "/athletes/dashboard", 
      icon: <Home size={20} />, 
      label: "Dashboard" 
    },
    { 
      path: "/athletes/winners", 
      icon: <Trophy size={20} />, 
      label: "Winners" 
    },
    { 
      path: "/athletes/applications", 
      icon: <FileText size={20} />, 
      label: "Applications" 
    },
    { 
      path: "/athletes/sponsorships", 
      icon: <DollarSign size={20} />, 
      label: "Sponsorships" 
    },
  ];

  return (
    <>
      <nav className={`bg-white text-gray-700 h-screen fixed top-0 left-0 z-10 transition-all duration-300 
                      ${isCollapsed ? "w-20" : "w-64"} 
                      ${isMobileMenuOpen ? "left-0" : "-left-full md:left-0"} 
                      border-r border-gray-100 shadow-sm`}>
        <div className="flex flex-col h-full">
          {/* Logo and Collapse Button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            {!isCollapsed && (
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center text-white">
                  A
                </div>
                <span className="ml-3 text-lg font-light">Athlete Portal</span>
              </div>
            )}
            {isCollapsed && (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center text-white mx-auto">
                A
              </div>
            )}
          </div>
          
          {/* Profile Section */}
          <div className="px-4 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-300 to-indigo-300 flex items-center justify-center text-white text-sm font-medium">
                  JD
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-white"></div>
              </div>
              {!isCollapsed && (
                <div>
                  <h3 className="font-medium text-gray-800">John Doe</h3>
                  <p className="text-xs text-gray-500">Elite Athlete</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="flex flex-col py-6 space-y-1 overflow-y-auto flex-grow px-3">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`px-4 py-3 rounded-lg flex items-center transition-all ${
                  isActive(item.path) 
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border-l-4 border-blue-400" 
                    : "hover:bg-gray-50"
                } ${isCollapsed ? "justify-center" : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className={`${isActive(item.path) ? "text-blue-500" : "text-gray-500"}`}>
                  {item.icon}
                </span>
                {!isCollapsed && <span className="ml-3 font-light">{item.label}</span>}
              </Link>
            ))}
            
            {/* Profile Link */}
            <Link 
              to="#" 
              className={`px-4 py-3 rounded-lg flex items-center transition-all hover:bg-gray-50 ${isCollapsed ? "justify-center" : ""}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="text-gray-500">
                <User size={20} />
              </span>
              {!isCollapsed && <span className="ml-3 font-light">Profile</span>}
            </Link>
          </div>
          
          {/* Logout Button */}
          <div className="mt-auto p-4">
            <Link 
              to="/login" 
              className={`px-4 py-3 rounded-lg flex items-center transition-all text-red-500 hover:bg-red-50 hover:text-red-600 ${isCollapsed ? "justify-center" : ""}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LogOut size={20} />
              {!isCollapsed && <span className="ml-3 font-light">Log out</span>}
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed bottom-6 right-6 z-50 md:hidden w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg flex items-center justify-center"
      >
        {isMobileMenuOpen ? <ChevronLeft size={24} /> : <Home size={24} />}
      </button>
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-30 backdrop-blur-sm z-[5] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default AthleteNavbar;
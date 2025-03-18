import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { 
  LayoutDashboard, 
  Medal, 
  ClipboardList, 
  LineChart, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const InstitutionNavbar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: "/institution/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/institution/athletes", icon: <Medal size={20} />, label: "Athletes" },
    { path: "/institution/register-athlete", icon: <ClipboardList size={20} />, label: "Register" },
    { path: "/institution/monitor-participation", icon: <LineChart size={20} />, label: "Monitor" },
  ];

  return (
    <nav className={`bg-white text-gray-700 h-screen fixed top-0 left-0 z-10 transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"} border-r border-gray-100 shadow-sm`}>
      <div className="flex flex-col h-full">
        {/* Logo and Collapse Button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          {!isCollapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-blue-400 flex items-center justify-center text-white">
                I
              </div>
              <span className="ml-3 text-lg font-light">Institution Portal</span>
            </div>
          )}
        </div>
        
        {/* Navigation Links */}
        <div className="flex flex-col py-6 space-y-1 overflow-y-auto flex-grow px-3">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-3 rounded-lg flex items-center transition-all ${
                isActive(item.path) 
                  ? "bg-gradient-to-r from-teal-50 to-blue-50 text-blue-600 border-l-4 border-blue-400" 
                  : "hover:bg-gray-50"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <span className={`${isActive(item.path) ? "text-blue-500" : "text-gray-500"}`}>
                {item.icon}
              </span>
              {!isCollapsed && <span className="ml-3 font-light">{item.label}</span>}
            </Link>
          ))}
        </div>
        
        {/* Logout Button */}
        <div className="mt-auto p-4">
          <Link 
            to="/login" 
            className={`px-4 py-3 rounded-lg flex items-center transition-all text-red-500 hover:bg-red-50 hover:text-red-600 ${isCollapsed ? "justify-center" : ""}`}
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="ml-3 font-light">Log out</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default InstitutionNavbar;
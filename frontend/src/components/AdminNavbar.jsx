import { Link } from "react-router-dom";
import { useState } from "react";
import { 
  Users, 
  DollarSign, 
  Award, 
  Building, 
  Trophy, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const AdminNavbar = ({ setActiveSection, activeSection }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const navItems = [
    { id: "athletes", icon: <Users size={20} />, label: "Athletes" },
    { id: "sponsors", icon: <DollarSign size={20} />, label: "Sponsors" },
    { id: "council", icon: <Award size={20} />, label: "Council" },
    { id: "institutions", icon: <Building size={20} />, label: "Institutions" },
    { id: "tournaments", icon: <Trophy size={20} />, label: "Tournaments" }
  ];

  return (
    <nav className={`bg-white text-gray-700 h-screen fixed top-0 left-0 z-10 transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"} border-r border-gray-100 shadow-sm`}>
      <div className="flex flex-col h-full">
        {/* Logo and Collapse Button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          {!isCollapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center text-white">
                A
              </div>
              <span className="ml-3 text-lg font-light">Admin Portal</span>
            </div>
          )}
          {isCollapsed && (
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center text-white mx-auto">
              A
            </div>
          )}
        </div>
        
        {/* Navigation Links */}
        <div className="flex flex-col py-6 space-y-1 overflow-y-auto flex-grow px-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`px-4 py-3 rounded-lg flex items-center transition-all ${
                activeSection === item.id 
                  ? "bg-gradient-to-r from-purple-50 to-blue-50 text-blue-600 border-l-4 border-blue-400" 
                  : "hover:bg-gray-50"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <span className={`${activeSection === item.id ? "text-blue-500" : "text-gray-500"}`}>
                {item.icon}
              </span>
              {!isCollapsed && <span className="ml-3 font-light">{item.label}</span>}
            </button>
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

export default AdminNavbar;
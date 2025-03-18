import { Link } from "react-router-dom";
import { useState } from "react";
import { 
  Users, 
  DollarSign, 
  Award, 
  Building, 
  Trophy, 
  LogOut,
  Menu,
  ChevronRight
} from "lucide-react";

const AdminNavbar = ({ setActiveSection, activeSection }) => {
  const [collapsed, setCollapsed] = useState(false);
  
  const navItems = [
    { id: "athletes", icon: <Users size={20} />, label: "Athletes" },
    { id: "sponsors", icon: <DollarSign size={20} />, label: "Sponsors" },
    { id: "council", icon: <Award size={20} />, label: "Council" },
    { id: "institutions", icon: <Building size={20} />, label: "Institutions" },
    { id: "tournaments", icon: <Trophy size={20} />, label: "Tournaments" }
  ];

  return (
    <div className={`relative min-h-screen bg-gray-900 text-white transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}>
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <div className={`flex items-center ${collapsed ? "justify-center w-full" : ""}`}>
          {!collapsed && <span className="text-xl font-bold">Admin Login</span>}
          {collapsed && <Trophy size={24} />}
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="p-1 rounded-full hover:bg-gray-700"
        >
          {collapsed ? <ChevronRight size={20} /> : <Menu size={20} />}
        </button>
      </div>
      
      <div className="py-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`flex items-center w-full py-3 px-4 hover:bg-gray-800 transition-colors ${
              activeSection === item.id ? "bg-blue-600 text-white" : "text-gray-300"
            }`}
          >
            <span className={`${collapsed ? "mx-auto" : "mr-3"}`}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </div>
      
      <div className="absolute bottom-0 left-0 w-full">
        <Link 
          to="/login" 
          className={`flex items-center py-4 px-4 text-red-400 hover:bg-gray-800 transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={20} className={`${collapsed ? "mx-auto" : "mr-3"}`} />
          {!collapsed && <span>Logout</span>}
        </Link>
      </div>
    </div>
  );
};

export default AdminNavbar;

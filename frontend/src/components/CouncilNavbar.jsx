import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, Trophy, Clipboard, Award, LogOut, ChevronRight } from "lucide-react";

const CouncilNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/council/dashboard", name: "Dashboard", icon: <Home size={20} /> },
    { path: "/manage/tournaments", name: "Tournaments", icon: <Trophy size={20} /> },
    { path: "/manage/applications", name: "Applications", icon: <Clipboard size={20} /> },
    { path: "/manage/winners", name: "Winners", icon: <Award size={20} /> },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={toggleSidebar} 
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-purple-600 text-white shadow-lg md:hidden"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-purple-800 to-purple-600 text-white shadow-2xl z-40 transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-0 md:w-20"
        } overflow-hidden`}
      >
        {/* Logo / Header */}
        <div className="p-6 flex items-center justify-center">
          <div className={`flex items-center space-x-3 ${!isOpen && "md:hidden"}`}>
            <span className="text-3xl font-bold">🏆</span>
            <h1 className={`text-xl font-bold transition-opacity duration-300 ${!isOpen && "md:opacity-0"}`}>Council</h1>
          </div>
          {!isOpen && (
            <span className="text-3xl font-bold hidden md:block">🏆</span>
          )}
        </div>

        {/* Menu Items */}
        <div className="mt-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center py-4 px-6 transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-purple-900 border-r-4 border-white"
                  : "hover:bg-purple-700"
              }`}
            >
              <div className="flex items-center">
                <span>{item.icon}</span>
                <span className={`ml-4 transition-opacity duration-300 ${!isOpen && "md:hidden"}`}>
                  {item.name}
                </span>
              </div>
              {isActive(item.path) && (
                <ChevronRight className={`ml-auto transition-opacity duration-300 ${!isOpen && "md:hidden"}`} size={16} />
              )}
            </Link>
          ))}
        </div>

      {/* Logout Button */}
      <div className="absolute bottom-8 w-full px-6">
        <Link
          to="/login"
          className={`flex items-center justify-center md:justify-start py-3 px-4 rounded-lg bg-red-500 hover:bg-red-600 transition-all duration-200 text-white font-semibold`}
        >
          <LogOut size={22} className="mr-2" /> {/* Logout Icon */}
          <span className={`ml-2 transition-opacity duration-300 ${!isOpen ? "hidden" : "block"}`}>
            Logout
          </span>
        </Link>
      </div>

      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default CouncilNavbar;
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const CouncilNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const location = useLocation();

  // Track scroll position to add visual effects based on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/council/dashboard", name: "Dashboard" },
    { path: "/manage/tournaments", name: "Tournaments" },
    { path: "/manage/applications", name: "Applications" },
    { path: "/manage/winners", name: "Winners" },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={toggleSidebar} 
        className="fixed top-4 left-4 z-50 px-4 py-2 rounded-lg bg-indigo-800 text-white font-medium md:hidden transition-all duration-200 hover:bg-indigo-700"
      >
        {isOpen ? "Close Menu" : "Menu"}
      </button>

      {/* Sidebar Navigation */}
      <div 
        className={`fixed top-0 left-0 h-full bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 text-white shadow-xl z-40 transition-all duration-300 ease-in-out ${
          isOpen ? "w-72" : "w-0 md:w-64"
        } overflow-hidden`}
      >
        {/* Logo / Header */}
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-indigo-600 opacity-80"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-opacity-30 bg-black flex flex-col items-center justify-center p-6">
            <div className="text-5xl font-bold mb-2">🏆</div>
            <h1 className="text-2xl font-bold tracking-wider text-white">Council Login</h1>
            <div className="w-16 h-1 bg-white mt-3 rounded-full"></div>
          </div>
        </div>

        {/* Navigation Links */}
        {/* Navigation Links */}
<div className="mt-8 px-4">
  <div className="mb-6 px-4">
    <h2 className="text-xs uppercase tracking-wider text-indigo-300 font-semibold">Main Navigation</h2>
  </div>

  {navItems.map((item) => (
    <Link
      key={item.path}
      to={item.path}
      className={`block relative mb-2 rounded-lg transition-all duration-200 p-4 ${
        isActive(item.path)
          ? "bg-gray-800 text-white"
          : "hover:bg-gray-700 text-gray-300"
      }`}
    >
      <div className="relative z-10 flex items-center">
        <span className="font-medium text-lg">{item.name}</span>
      </div>

      {isActive(item.path) && (
        <div className="absolute left-0 top-0 h-full w-1 bg-indigo-500"></div>
      )}
    </Link>
  ))}
</div>


        {/* User Profile Area */}
        <div className="absolute bottom-24 w-full px-6">
          <div className="p-4 rounded-lg bg-indigo-800 bg-opacity-50">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white text-indigo-800 flex items-center justify-center font-bold text-lg">
                AC
              </div>
              <div className="ml-3">
                <p className="font-medium">Admin Council</p>
                <p className="text-xs text-indigo-200">Tournament Manager</p>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-8 w-full px-6">
          <Link
            to="/login"
            className="block w-full text-center py-3 px-4 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 transition-all duration-200 text-white font-medium"
          >
           Log Out
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
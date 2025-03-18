import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Trophy, 
  FileText, 
  DollarSign, 
  LogOut, 
  Menu,
  X,
  ChevronRight,
  User,
} from "lucide-react";

const AthleteNavbar = () => {
  const location = useLocation();
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  // Check if current path matches the link
  const isActive = (path) => location.pathname === path;

  // Handle window resize to switch between horizontal and vertical layout
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsHorizontal(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Vertical Layout
  const renderVerticalNav = () => (
    <div className={`fixed ${isMobileMenuOpen ? "left-0" : "-left-full md:left-0"} top-0 h-screen transition-all duration-300 ease-in-out bg-gradient-to-br from-indigo-50 via-white to-blue-50 border-r border-indigo-100 text-indigo-900 z-50 w-64 shadow-lg overflow-hidden`}>
      {/* Logo & Toggle Section */}
      <div className="flex items-center justify-between p-5 border-b border-indigo-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xl font-bold shadow-md">
            A
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Athlete Login</h1>
        </div>
      </div>
      
      {/* Profile Section */}
      <div className="px-4 py-4 border-b border-indigo-100">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-300 to-indigo-400 flex items-center justify-center text-white text-lg font-medium shadow">
              JD
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-white"></div>
          </div>
          <div>
            <h3 className="font-medium text-indigo-900">John Doe</h3>
            <p className="text-xs text-indigo-600">Elite Athlete</p>
          </div>
        </div>
      </div>
      
      {/* Navigation Section */}
      <div className="p-4">
        <p className="text-xs font-medium text-indigo-400 mb-3 uppercase tracking-wider px-2">Main Menu</p>
        <div className="flex flex-col gap-1">
          {navItems.map((item, index) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`
                flex items-center gap-4 p-3 rounded-xl transition-all 
                ${isActive(item.path) 
                  ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-800 font-medium shadow-sm" 
                  : "hover:bg-indigo-50 text-indigo-600"
                }
              `}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className={`${isActive(item.path) ? "text-blue-600" : "text-indigo-400"}`}>
                {item.icon}
              </div>
              <span>{item.label}</span>
              {isActive(item.path) && (
                <div className="ml-auto">
                  <ChevronRight size={16} className="text-blue-500" />
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Settings & Support */}
      <div className="p-4 mt-2">
        <p className="text-xs font-medium text-indigo-400 mb-3 uppercase tracking-wider px-2">Others</p>
        <Link 
          to="#" 
          className="flex items-center gap-4 p-3 rounded-xl transition-all hover:bg-indigo-50 text-indigo-600"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="text-indigo-400">
            <User size={20} />
          </div>
          <span>Profile</span>
        </Link>
      </div>
      
      {/* Logout Button */}
      <div className="absolute bottom-8 w-full px-4">
        <Link 
          to="/login" 
          className="flex items-center gap-3 p-3 text-red-600 hover:text-red-700 transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  );

  // Mobile Toggle Button
  const renderMobileToggle = () => (
    <button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="fixed bottom-6 right-6 z-50 md:hidden w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg flex items-center justify-center"
    >
      {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );

  // Mobile Overlay
  const renderMobileOverlay = () => (
    isMobileMenuOpen && (
      <div 
        className="fixed inset-0 bg-indigo-900 bg-opacity-30 backdrop-blur-sm z-40 md:hidden"
        onClick={() => setIsMobileMenuOpen(false)}
      />
    )
  );

  return (
    <>
      {isHorizontal ? renderHorizontalNav() : renderVerticalNav()}
      {renderMobileToggle()}
      {renderMobileOverlay()}
    </>
  );
};

export default AthleteNavbar;
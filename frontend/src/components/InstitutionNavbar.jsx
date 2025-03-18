import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const InstitutionNavbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <nav className={`${isScrolled ? 'bg-gradient-to-r from-indigo-900 to-purple-900 shadow-lg' : 'bg-gradient-to-r from-indigo-800 to-purple-800'} 
                transition-all duration-300 sticky top-0 z-50`}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center py-4">
          {/* Logo and brand */}
          <div className="flex items-center space-x-3">
            <span className="text-2xl bg-white text-indigo-800 p-2 rounded-full shadow-md">🏫</span>
            <div>
              <h1 className="font-bold text-white text-xl">Institution Hub</h1>
              <p className="text-indigo-200 text-xs">Sports Management Portal</p>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1">
            <NavLink to="/institution/dashboard" isActive={isActive("/institution/dashboard")}>
              <span className="mr-2">📊</span> Dashboard
            </NavLink>
            
            <NavLink to="/institution/athletes" isActive={isActive("/institution/athletes")}>
              <span className="mr-2">🏆</span> Athletes
            </NavLink>
            
            <NavLink to="/institution/register-athlete" isActive={isActive("/institution/register-athlete")}>
              <span className="mr-2">📝</span> Register
            </NavLink>
            
            <NavLink to="/institution/monitor-participation" isActive={isActive("/institution/monitor-participation")}>
              <span className="mr-2">📈</span> Monitor
            </NavLink>
            
            <Link to="/login" className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition duration-200 flex items-center">
              <span className="mr-2">🚪</span> Logout
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white focus:outline-none" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            )}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-indigo-900 pb-4 pt-2 rounded-b-lg">
            <MobileNavLink to="/institution/dashboard" label="Dashboard" emoji="📊" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavLink to="/institution/athletes" label="Athletes" emoji="🏆" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavLink to="/institution/register-athlete" label="Register" emoji="📝" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavLink to="/institution/monitor-participation" label="Monitor" emoji="📈" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="px-4 pt-2">
              <Link 
                to="/login" 
                className="block w-full text-center bg-red-500 hover:bg-red-600 text-white py-2 rounded-md transition duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mr-2">🚪</span> Logout
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Desktop NavLink component
const NavLink = ({ children, to, isActive }) => (
  <Link 
    to={to} 
    className={`px-4 py-2 font-medium rounded-md transition duration-200 flex items-center ${
      isActive 
        ? 'bg-white text-indigo-800 shadow-md' 
        : 'text-white hover:bg-indigo-700'
    }`}
  >
    {children}
  </Link>
);

// Mobile NavLink component
const MobileNavLink = ({ to, label, emoji, onClick }) => (
  <Link 
    to={to} 
    className="block px-4 py-2 text-indigo-100 hover:bg-indigo-800 transition duration-200"
    onClick={onClick}
  >
    <span className="mr-2">{emoji}</span> {label}
  </Link>
);

export default InstitutionNavbar;
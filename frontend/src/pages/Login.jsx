import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Animation states
  const [floatingElements, setFloatingElements] = useState([]);
  
  // Generate random floating elements on component mount
  useEffect(() => {
    const elements = [];
    const shapes = ['circle', 'square', 'triangle'];
    
    for (let i = 0; i < 15; i++) {
      elements.push({
        id: i,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        size: Math.floor(Math.random() * 40) + 10,
        posX: Math.floor(Math.random() * 100),
        posY: Math.floor(Math.random() * 100),
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.4 + 0.1,
        rotation: Math.floor(Math.random() * 360),
        rotationSpeed: (Math.random() - 0.5) * 2
      });
    }
    
    setFloatingElements(elements);
    
    // Animation frame for moving elements
    let animationFrameId;
    const animate = () => {
      setFloatingElements(prevElements => 
        prevElements.map(el => {
          let newPosX = el.posX + el.speedX;
          let newPosY = el.posY + el.speedY;
          let newRotation = el.rotation + el.rotationSpeed;
          
          // Bounce off edges
          if (newPosX <= 0 || newPosX >= 100) el.speedX *= -1;
          if (newPosY <= 0 || newPosY >= 100) el.speedY *= -1;
          
          return {
            ...el,
            posX: newPosX <= 0 ? 0 : newPosX >= 100 ? 100 : newPosX,
            posY: newPosY <= 0 ? 0 : newPosY >= 100 ? 100 : newPosY,
            rotation: newRotation
          };
        })
      );
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credentials.email.trim(),
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.msg || "Login failed");

      // Store auth token
      localStorage.setItem("authToken", data.token);

      // Decode JWT token to extract user role & institution ID
      const decodedToken = JSON.parse(atob(data.token.split(".")[1]));
      const userRole = decodedToken.user.role;
      const instituteId = decodedToken.user.instituteId || null;

      // If the user is an Institution, store institutionId
      if (userRole === "Institution" && instituteId) {
        localStorage.setItem("instituteId", instituteId);
      }

      // Redirect based on role
      switch (userRole) {
        case "Admin":
          navigate("/admin/dashboard");
          break;
        case "Athlete":
          navigate("/athletes/dashboard");
          break;
        case "Sponsor":
          navigate("/sponsor/dashboard");
          break;
        case "SportsCouncil":
          navigate("/council/dashboard");
          break;
        case "Institution":
          navigate("/institution/dashboard");
          break;
        default:
          navigate("/login");
          break;
      }
    } catch (error) {
      setError(error.message);
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to render a specific shape
  const renderShape = (shape, size, rotation) => {
    switch(shape) {
      case 'circle':
        return <div className="rounded-full h-full w-full bg-current"></div>;
      case 'square':
        return <div className="h-full w-full bg-current" style={{transform: `rotate(${rotation}deg)`}}></div>;
      case 'triangle':
        return (
          <div className="h-full w-full" style={{transform: `rotate(${rotation}deg)`}}>
            <div className="w-0 h-0 border-l-[50px] border-l-transparent border-b-[100px] border-b-current border-r-[50px] border-r-transparent" style={{transform: 'scale(0.5)'}}></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-green-500 relative overflow-hidden">
      {/* Animated background elements */}
      {floatingElements.map(el => (
        <div 
          key={el.id}
          className="absolute pointer-events-none text-white"
          style={{
            left: `${el.posX}%`,
            top: `${el.posY}%`,
            width: `${el.size}px`,
            height: `${el.size}px`,
            opacity: el.opacity,
            transform: `rotate(${el.rotation}deg)`,
            transition: 'transform 0.5s linear',
            zIndex: 0
          }}
        >
          {renderShape(el.shape, el.size, el.rotation)}
        </div>
      ))}
      
      {/* Sports-related silhouettes */}
      <div className="absolute bottom-8 left-8 opacity-20 text-white h-32 w-32">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M12,4c0.8,0,1.5,0.1,2.2,0.3L11,7.5L6.5,6.5L9,3.8
          C10,3.3,11,4,12,4z M4,12c0-1.8,0.6-3.4,1.6-4.8l4.3,1.1L8.7,12l-4.3,1.2C4.1,12.9,4,12.4,4,12z M12,20c-2.9,0-5.4-1.6-6.9-4
          l4.4-1.2l2.7,4.6c-0.1,0-0.2,0.1-0.2,0.1C11.6,19.9,12,20,12,20z M13.5,18.6l-2.9-4.9l1.4-4.3l5.7-2.6c0.7,1.2,1.1,2.5,1.2,3.9
          l-2.7,2.7L13.5,18.6z M19.1,9.1L14.1,11l-1.1-3.4l3.3-3.3C17.7,5.4,18.7,7.1,19.1,9.1z"/>
        </svg>
      </div>
      
      <div className="absolute top-20 right-12 opacity-20 text-white h-24 w-24">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,5c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S13.1,5,12,5z M20,12c0,4.4-3.6,8-8,8s-8-3.6-8-8s3.6-8,8-8S20,7.6,20,12z M13,
          12V7h-2v5H8l4,4l4-4H13z"/>
        </svg>
      </div>
      
      <div className="absolute top-40 left-20 opacity-15 text-white h-32 w-32">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.27,6C13.72,6.95,14.05,8.18,15,8.73c0.95,0.55,2.18,0.22,2.73-0.73c0.55-0.95,0.22-2.18-0.73-2.73
          C16.05,4.72,14.82,5.05,14.27,6z M6.01,14.93C5.61,15.59,5.8,16.43,6.46,16.84l4.07,2.47l-2.46,4.07
          c-0.4,0.66-0.2,1.51,0.46,1.91c0.66,0.4,1.51,0.2,1.91-0.46l2.46-4.07l4.24,2.58c0.66,0.4,1.5,0.19,1.9-0.47
          c0.4-0.66,0.19-1.5-0.47-1.9l-4.24-2.58l2.59-4.27c0.4-0.66,0.19-1.5-0.47-1.9c-0.66-0.4-1.5-0.19-1.9,0.47l-2.59,4.27l-4.07-2.47
          C7.26,14.07,6.41,14.27,6.01,14.93z"/>
        </svg>
      </div>

      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden relative z-10 backdrop-blur-sm bg-opacity-90">
        {/* Left side decorative element */}
        <div className="h-2 bg-gradient-to-r from-blue-600 to-green-500"></div>
        
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800 flex items-center justify-center">
              <span className="mr-2">🏆</span> Sports Council
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-green-500 mx-auto mt-2 rounded-full"></div>
            <p className="text-gray-600 mt-3">Welcome back, champion!</p>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md animate-pulse" role="alert">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <div className="relative group">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full p-4 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 group-hover:border-blue-300"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 font-medium">Password</label>
              </div>
              <div className="relative group">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full p-4 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 group-hover:border-blue-300"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-bold py-4 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  Sign In <FaSignInAlt className="ml-2" />
                </span>
              )}
            </button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              New to Sports Council?{" "}
              <Link to="/register" className="text-blue-600 font-bold hover:underline relative inline-block group">
                <span className="relative z-10">Create an account</span>
                <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </Link>
            </p>
          </div>
          
          {/* Recent achievements section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-3">Recent Achievements</h3>
            <div className="space-y-2">
              <div className="flex items-center text-xs text-gray-500">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                <span>National Championships: 24 medals won</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                <span>12 athletes qualified for international events</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                <span>3 new sports facilities inaugurated</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
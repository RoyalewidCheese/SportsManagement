import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaLock, FaUsers, FaMapMarkerAlt, FaUserPlus } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    location: "",
    image: null,
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!formData.image) {
      setError("Profile picture is required!");
      return;
    }

    // Create FormData for backend request
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name.trim());
    formDataToSend.append("email", formData.email.trim());
    formDataToSend.append("password", formData.password);
    formDataToSend.append("role", formData.role);
    formDataToSend.append("image", formData.image);

    // If registering as an Institution, add `location`
    if (formData.role === "Institution") {
      if (!formData.location.trim()) {
        setError("Location is required for institutions!");
        return;
      }
      formDataToSend.append("location", formData.location.trim());
    }

    console.log("📤 Sending data to backend:", [...formDataToSend.entries()]); // Debugging

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      console.log("✅ Response from backend:", data); // Debugging

      if (!response.ok) throw new Error(data.msg || "Registration failed");

      alert("🎉 Registration successful! Redirecting to login...");
      navigate("/login");
    } catch (error) {
      setError(error.message);
      console.error("🔥 Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to render a specific shape
  const renderShape = (shape, size, rotation) => {
    switch (shape) {
      case 'circle':
        return <div className="rounded-full h-full w-full bg-current"></div>;
      case 'square':
        return <div className="h-full w-full bg-current" style={{ transform: `rotate(${rotation}deg)` }}></div>;
      case 'triangle':
        return (
          <div className="h-full w-full" style={{ transform: `rotate(${rotation}deg)` }}>
            <div className="w-0 h-0 border-l-[50px] border-l-transparent border-b-[100px] border-b-current border-r-[50px] border-r-transparent" style={{ transform: 'scale(0.5)' }}></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-500 via-blue-500 to-blue-600 relative overflow-hidden py-4">
  {/* Animated background elements (smaller and fewer) */}
  {floatingElements.map(el => (
    <div
      key={el.id}
      className="absolute pointer-events-none text-white"
      style={{
        left: `${el.posX}%`,
        top: `${el.posY}%`,
        width: `${el.size * 0.7}px`, // Reduce size by 30%
        height: `${el.size * 0.7}px`,
        opacity: el.opacity * 0.8, // Reduce opacity
        transform: `rotate(${el.rotation}deg)`,
        transition: 'transform 0.5s linear',
        zIndex: 0
      }}
    >
      {renderShape(el.shape, el.size * 0.7, el.rotation)}
    </div>
  ))}

  {/* Sports-related silhouettes (smaller) */}
  <div className="absolute bottom-4 left-4 opacity-15 text-white h-20 w-20">
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M12,4c0.8,0,1.5,0.1,2.2,0.3L11,7.5L6.5,6.5L9,3.8
      C10,3.3,11,4,12,4z M4,12c0-1.8,0.6-3.4,1.6-4.8l4.3,1.1L8.7,12l-4.3,1.2C4.1,12.9,4,12.4,4,12z M12,20c-2.9,0-5.4-1.6-6.9-4
      l4.4-1.2l2.7,4.6c-0.1,0-0.2,0.1-0.2,0.1C11.6,19.9,12,20,12,20z M13.5,18.6l-2.9-4.9l1.4-4.3l5.7-2.6c0.7,1.2,1.1,2.5,1.2,3.9
      l-2.7,2.7L13.5,18.6z M19.1,9.1L14.1,11l-1.1-3.4l3.3-3.3C17.7,5.4,18.7,7.1,19.1,9.1z"/>
    </svg>
  </div>

  <div className="absolute top-12 right-8 opacity-15 text-white h-16 w-16">
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,5c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S13.1,5,12,5z M20,12c0,4.4-3.6,8-8,8s-8-3.6-8-8s3.6-8,8-8S20,7.6,20,12z M13,
      12V7h-2v5H8l4,4l4-4H13z"/>
    </svg>
  </div>

  <div className="absolute top-28 left-12 opacity-10 text-white h-20 w-20">
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.27,6C13.72,6.95,14.05,8.18,15,8.73c0.95,0.55,2.18,0.22,2.73-0.73c0.55-0.95,0.22-2.18-0.73-2.73
      C16.05,4.72,14.82,5.05,14.27,6z M6.01,14.93C5.61,15.59,5.8,16.43,6.46,16.84l4.07,2.47l-2.46,4.07
      c-0.4,0.66-0.2,1.51,0.46,1.91c0.66,0.4,1.51,0.2,1.91-0.46l2.46-4.07l4.24,2.58c0.66,0.4,1.5,0.19,1.9-0.47
      c0.4-0.66,0.19-1.5-0.47-1.9l-4.24-2.58l2.59-4.27c0.4-0.66,0.19-1.5-0.47-1.9c-0.66-0.4-1.5-0.19-1.9,0.47l-2.59,4.27l-4.07-2.47
      C7.26,14.07,6.41,14.27,6.01,14.93z"/>
    </svg>
  </div>

  <div className="w-full max-w-lg bg-white shadow-xl rounded-lg overflow-hidden relative z-10 backdrop-blur-sm bg-opacity-90 mx-3">
    {/* Top decorative element */}
    <div className="h-1 bg-gradient-to-r from-green-500 to-blue-600"></div>

    <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800 flex items-center justify-center">
              <span className="mr-2">🏆</span> Join the Sports Council
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-green-500 mx-auto mt-2 rounded-full"></div>
            <p className="text-gray-600 mt-3">Create an account to get started</p>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md animate-pulse" role="alert">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Two-column layout for top form fields */}
        <div className="grid grid-cols-2 gap-3">
          {/* Name Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Full Name</label>
            <div className="relative group">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" />
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                className="w-full p-4 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 group-hover:border-blue-300"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <div className="relative group">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" />
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
        </div>

        {/* Two-column layout for role and file */}
        <div className="grid grid-cols-2 gap-3">
          {/* Role Selection */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Select Role</label>
            <div className="relative group">
              <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" />
              <select
                name="role"
                className="w-full p-4 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 group-hover:border-blue-300 appearance-none"
                required
                onChange={handleChange}
                value={formData.role}
              >
                <option value="">Select Role</option>
                <option value="Sponsor">Sponsor</option>
                <option value="SportsCouncil">Sports Council</option>
                <option value="Institution">School/College</option>
              </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
            </div>
          </div>

          {/* Profile Picture Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Profile Picture</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                className="w-full p-4 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:outline-none file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 text-xs"
                required
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        {/* Institution Location (Only for Institutions) */}
        {formData.role === "Institution" && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">Institution Location</label>
            <div className="relative group">
              <FaMapMarkerAlt className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                name="location"
                placeholder="Enter Institution Location"
                className="w-full p-4 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 group-hover:border-blue-300 appearance-none"
                onChange={handleChange}
                required
              />
            </div>
          </div>
        )}

        {/* Two-column layout for password fields */}
        <div className="grid grid-cols-2 gap-3">
          {/* Password Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <div className="relative group">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" />
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                className="w-full p-4 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 group-hover:border-blue-300 appearance-none"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
            <div className="relative group">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter password"
                className="w-full p-4 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 group-hover:border-blue-300 appearance-none"
                required
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Register Button */}
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
              Register <FaUserPlus className="ml-2" />
            </span>
          )}
        </button>
      </form>

      <div className="mt-3 text-center">
            <p className="text-gray-600">
            Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-bold hover:underline relative inline-block group">
                <span className="relative z-10">Sign In</span>
                <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </Link>
            </p>
      </div>
      
          {/* Sports achievements */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-3">Join our community highlights</h3>
            <div className="space-y-2">
              <div className="flex items-center text-xs text-gray-500">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                <span>Connect with 500+ sports organizations</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                <span>Access to exclusive sports events</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                <span>Discover sponsorship opportunities</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
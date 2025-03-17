import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaUsers, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    location: "", // ✅ Added for Institutions
    image: null,
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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

    // ✅ Create FormData for backend request
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name.trim());
    formDataToSend.append("email", formData.email.trim());
    formDataToSend.append("password", formData.password);
    formDataToSend.append("role", formData.role);
    formDataToSend.append("image", formData.image);

    // ✅ If registering as an Institution, add `location`
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
        body: formDataToSend, // ✅ Send as FormData
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-500 to-blue-600 p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-800">🏆 Join the Sports Council</h1>
          <p className="text-gray-600 mt-1">Create an account to get started</p>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        {/* Form */}
        <form className="mt-6" onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Full Name</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-4 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                className="w-full p-3 pl-10 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full p-3 pl-10 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Profile Picture Input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
              onChange={handleFileChange}
            />
          </div>

          {/* Role Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Select Role</label>
            <div className="relative">
              <FaUsers className="absolute left-3 top-4 text-gray-400" />
              <select
                name="role"
                className="w-full p-3 pl-10 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
                onChange={handleChange}
                value={formData.role}
              >
                <option value="">Select Role</option>
                <option value="Sponsor">Sponsor</option>
                <option value="SportsCouncil">Sports Council</option>
                <option value="Institution">School/College</option>
              </select>
            </div>
          </div>

          {/* Institution Location (Only for Institutions) */}
          {formData.role === "Institution" && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Institution Location</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-4 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  placeholder="Enter Institution Location"
                  className="w-full p-3 pl-10 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          {/* Password Input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-4 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                className="w-full p-3 pl-10 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
              onChange={handleChange}
            />
          </div>

          {/* Register Button */}
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-md transition" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button><div className="mt-4 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Login
            </Link>
          </p>
        </div>
          
        </form>
        
      </div>
    </div>
  );
};

export default Register;

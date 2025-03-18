import { useState } from "react";
import axios from "axios";
import InstitutionNavbar from "../components/InstitutionNavbar";
import { Link } from "react-router-dom";

const RegisterAthlete = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    admissionNumber: "",
    sport: "",
    image: null,
  });
  
  // Sample recent registrations
  const recentRegistrations = [
    { id: 1, name: "Emma Wilson", sport: "Swimming", status: "Complete", date: "Yesterday" },
    { id: 2, name: "Michael Chen", sport: "Basketball", status: "Complete", date: "2 days ago" },
    { id: 3, name: "Sofia Rodriguez", sport: "Tennis", status: "Complete", date: "3 days ago" },
  ];
  
  // Common sports for quick selection
  const popularSports = [
    { name: "Football", icon: "⚽" },
    { name: "Basketball", icon: "🏀" },
    { name: "Swimming", icon: "🏊" },
    { name: "Tennis", icon: "🎾" },
    { name: "Track", icon: "🏃" },
  ];

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSportSelect = (sport) => {
    setFormData({ ...formData, sport });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Unauthorized. Please log in again.");
        return;
      }

      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      await axios.post("http://localhost:8000/api/institution/register-athlete", formDataToSend, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      alert("Athlete registered successfully!");
      setFormData({ name: "", email: "", password: "", admissionNumber: "", sport: "", image: null });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Invalid token. Please log in again.");
        localStorage.removeItem("authToken");
      } else {
        console.error("🔥 Error registering athlete:", error.response?.data || error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <InstitutionNavbar />
        <div className="flex-1 ml-64 p-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Register New Athlete</h1>
            <p className="text-gray-600 mt-1">Add athletes to your institution's roster</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Registration Form Card */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
              <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Athlete Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Password</label>
                    <input 
                      type="password" 
                      name="password" 
                      value={formData.password} 
                      onChange={handleChange} 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Admission Number</label>
                    <input 
                      type="text" 
                      name="admissionNumber" 
                      value={formData.admissionNumber} 
                      onChange={handleChange} 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      required 
                    />
                  </div>
                </div>
                
                
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Profile Picture</label>
                  <div className="flex items-center space-x-6">
                    <div className="shrink-0">
                      <div className="h-16 w-16 object-cover rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-2xl">
                        {formData.image ? "📷" : "👤"}
                      </div>
                    </div>
                    <label className="block">
                      <span className="sr-only">Choose profile photo</span>
                      <input 
                        type="file" 
                        name="image" 
                        accept="image/*" 
                        onChange={handleChange}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                      />
                    </label>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transform transition hover:scale-105 font-medium"
                >
                  Register Athlete
                </button>
              </form>
            </div>
            
            {/* Info Cards */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white opacity-90">Total Athletes</p>
                    <p className="text-3xl font-bold mt-1">127</p>
                    <p className="text-xs mt-2 opacity-80">+5% this month</p>
                  </div>
                  <div className="text-4xl bg-white bg-opacity-20 p-3 rounded-full">🏆</div>
                </div>
              </div>
              
              {/* Recent Registrations */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Registrations</h3>
                <div className="space-y-3">
                  {recentRegistrations.map((registration) => (
                    <div key={registration.id} className="flex items-center bg-gray-50 rounded-lg p-3 transition hover:bg-gray-100">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        {registration.name.charAt(0)}
                      </div>
                      <div className="ml-3 flex-grow">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-gray-800">{registration.name}</h4>
                          <span className="bg-green-100 text-green-800 text-xs py-1 px-2 rounded-full">{registration.status}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <p className="text-xs text-gray-500">{registration.sport}</p>
                          <p className="text-xs text-gray-500">{registration.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/institution/athletes" className="block text-center text-indigo-600 hover:text-indigo-800 text-sm mt-4">
                  View All Athletes →
                </Link>
              </div>
              
              {/* Help Card */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-5 rounded-lg">
                <h4 className="font-semibold text-gray-800">Registration Tips</h4>
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  <li>• Ensure admission number is unique</li>
                  <li>• Use institution email when possible</li>
                  <li>• Profile images help with identification</li>
                  <li>• Strong passwords are recommended</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterAthlete;
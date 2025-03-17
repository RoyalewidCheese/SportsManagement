import { useState } from "react";
import axios from "axios";
import InstitutionNavbar from "../components/InstitutionNavbar";

const RegisterAthlete = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    admissionNumber: "",
    image: null,
  });

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
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
      setFormData({ name: "", email: "", password: "", admissionNumber: "", image: null });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Invalid token. Please log in again.");
        localStorage.removeItem("authToken");
        // Optionally, redirect to login page
      } else {
        console.error("🔥 Error registering athlete:", error.response?.data || error.message);
      }
    }
  };

  return (
    <div>
      <InstitutionNavbar />
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 text-center">🏆 Register Athlete</h2>
        <form onSubmit={handleSubmit} className="mt-6" encType="multipart/form-data">
          <label className="block text-gray-700">Athlete Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded mt-1" required />

          <label className="block text-gray-700 mt-4">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded mt-1" required />

          <label className="block text-gray-700 mt-4">Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded mt-1" required />

          <label className="block text-gray-700 mt-4">Admission Number</label>
          <input type="text" name="admissionNumber" value={formData.admissionNumber} onChange={handleChange} className="w-full p-2 border rounded mt-1" required />

          <label className="block text-gray-700 mt-4">Profile Picture</label>
          <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full p-2 border rounded mt-1" />

          <button type="submit" className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Register Athlete</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterAthlete;

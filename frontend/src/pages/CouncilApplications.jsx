import { useState, useEffect } from "react";
import axios from "axios";
import CouncilNavbar from "../components/CouncilNavbar";

const CouncilApplications = () => {
  const [applications, setApplications] = useState([]);

  // Fetch applications
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("❌ No auth token found. Redirecting to login...");
        window.location.href = "/login"; 
        return;
      }
  
      const response = await axios.get("http://localhost:8000/api/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("📥 Applications Response:", response.data); // Debugging
      setApplications(response.data);
    } catch (error) {
      console.error("🔥 Error fetching applications:", error.response?.data || error.message);
    }
  };

  const handleAction = async (id, status, tournamentId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("❌ No auth token found. Redirecting to login...");
        window.location.href = "/login";
        return;
      }
  
      if (!tournamentId) {
        console.error("❌ Tournament ID is missing! Cannot update application.");
        return;
      }
  
      console.log(`📢 Updating Application: ${id} Status: ${status} Tournament: ${tournamentId}`);
  
      await axios.put(`http://localhost:8000/api/applications/${id}`, { 
        status, 
        tournament: tournamentId // ✅ Send valid tournament ID
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      fetchApplications();
    } catch (error) {
      console.error(`🔥 Error updating application status to ${status}:`, error.response?.data || error.message);
    }
  };  

  return (
    <div>
      <CouncilNavbar />
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">📜 Tournament Applications</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-purple-600 text-white">
                <th className="p-3 text-left">Athlete</th>
                <th className="p-3 text-left">Tournament</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app._id} className="border-t border-gray-300">
                    <td className="p-3">{app.athlete?.name || "Unknown Athlete"}</td>
                    <td className="p-3">{app.tournament?.name || "Unknown Tournament"}</td>
                    <td className="p-3">
                      <span 
                        className={`px-2 py-1 text-sm rounded ${
                          app.status === "Approved" ? "bg-green-500 text-white" 
                          : app.status === "Rejected" ? "bg-red-500 text-white" 
                          : "bg-gray-500 text-white"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button 
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                        onClick={() => handleAction(app._id, "Approved", app.tournament?._id)}
                      >
                        ✅ Approve
                      </button>
                      <button 
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleAction(app._id, "Rejected", app.tournament?._id)}
                      >
                        ❌ Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-3 text-center text-gray-500">No applications found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CouncilApplications;

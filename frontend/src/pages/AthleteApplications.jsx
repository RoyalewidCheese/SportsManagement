import { useState, useEffect } from "react";
import axios from "axios";
import AthleteNavbar from "../components/AthleteNavbar";

const AthleteApplications = () => {
  const [applications, setApplications] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (user) fetchApplications();
  }, [user]);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return console.error("No auth token found");

      const response = await axios.get("http://localhost:8000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token || !user) return console.error("No auth token or user found");

      const response = await axios.get("http://localhost:8000/api/applications/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📥 API Response:", response.data); 

      // ✅ Ensure correct ID comparison
      const filteredApplications = response.data.filter(app => String(app.athlete._id) === String(user._id));

      console.log("✅ Filtered Applications:", filteredApplications); 
      setApplications(filteredApplications);
    } catch (error) {
      console.error("🔥 Error fetching applications:", error.response?.data || error.message);
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
  
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return console.error("No auth token found");
  
      await axios.delete(`http://localhost:8000/api/applications/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log(`🗑 Application ${applicationId} deleted successfully.`);
      setApplications(applications.filter(app => app._id !== applicationId));
    } catch (error) {
      console.error("🔥 Error deleting application:", error.response?.data || error.message);
    }
  };
  
  return (
    <div>
      <AthleteNavbar/>
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">📜 My Applications</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-purple-600 text-white">
                <th className="p-3 text-center">Athlete</th>
                <th className="p-3 text-center">Tournament</th>
                <th className="p-3 text-center">Location</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app._id} className="border-t border-gray-300">
                    <td className="p-3 text-center">{user?.name || "Unknown Athlete"}</td>
                    <td className="p-3 text-center">{app.tournamentName}</td>
                    <td className="p-3 text-center">{app.tournament?.location || "Unknown"}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-1 text-sm rounded ${
                        app.status === "Approved" ? "bg-green-500 text-white"
                        : app.status === "Rejected" ? "bg-red-500 text-white"
                        : "bg-gray-500 text-white"
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        onClick={() => handleDeleteApplication(app._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-3 text-center text-gray-500">No applications found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AthleteApplications;
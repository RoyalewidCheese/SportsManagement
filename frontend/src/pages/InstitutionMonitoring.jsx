import { useState, useEffect } from "react";
import axios from "axios";
import InstitutionNavbar from "../components/InstitutionNavbar";

const InstitutionMonitoring = () => {
  const [monitoringData, setMonitoringData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonitoringData = async () => {
      console.log("📡 Fetching monitoring data...");

      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("❌ User not authenticated. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        console.log("🔹 Sending request to backend...");
        const response = await axios.get("http://localhost:8000/api/monitor", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Monitoring Data Received:", response.data);
        setMonitoringData(response.data);
      } catch (err) {
        console.error("🔥 Error fetching monitoring data:", err.response?.data || err.message);
        setError(err.response?.data?.msg || "Failed to fetch monitoring data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMonitoringData();
  }, []);

  return (
    <div>
      <InstitutionNavbar />
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg">
        <h2 className="text-3xl font-bold text-gray-800 text-center">📊 Tournament Participation</h2>

        {loading ? (
          <p className="text-center text-gray-500 mt-4">Loading monitoring data...</p>
        ) : error ? (
          <p className="text-center text-red-500 mt-4">{error}</p>
        ) : monitoringData.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">No tournament participation records found.</p>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-purple-600 text-white">
                  <th className="p-3 text-left">Athlete</th>
                  <th className="p-3 text-left">Admission No.</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Profile Picture</th>
                  <th className="p-3 text-left">Tournament Name</th>
                  <th className="p-3 text-left">Location</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {monitoringData.map((entry) => (
                  <tr key={entry._id} className="border-t border-gray-300">
                    <td className="p-3">{entry.athlete.name}</td>
                    <td className="p-3">{entry.athlete.admissionNumber}</td>
                    <td className="p-3">{entry.athlete.email}</td>
                    <td className="p-3">
                      <img
                        src={`http://localhost:8000${entry.athlete.image}`}
                        alt={entry.athlete.name}
                        className="w-16 h-16 object-cover rounded-full border-2 border-green-600"
                        onError={(e) => (e.target.src = "/default-profile.png")}
                      />
                    </td>
                    <td className="p-3">{entry.tournament.name}</td>
                    <td className="p-3">{entry.tournament.location}</td>
                    <td className="p-3">{new Date(entry.tournament.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstitutionMonitoring;

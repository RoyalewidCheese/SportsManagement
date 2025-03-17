import { useState, useEffect } from "react";
import axios from "axios";
import AthleteNavbar from "../components/AthleteNavbar";

const AthletesSponsorships = () => {
  const [sponsors, setSponsors] = useState([]);
  const [applications, setApplications] = useState([]);
  const [amountRequested, setAmountRequested] = useState("");
  const [selectedSponsor, setSelectedSponsor] = useState("");

  useEffect(() => {
    fetchSponsors();
    fetchApplications();
  }, []);

  const fetchSponsors = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("❌ No auth token found.");
        return;
      }
  
      console.log("📢 Fetching Sponsors with Auth Token:", token); // Debugging Log
  
      const response = await axios.get("http://localhost:8000/api/sponsors", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("✅ Sponsors API Response:", response.data); // Debugging Log
  
      if (!Array.isArray(response.data) || response.data.length === 0) {
        console.warn("⚠️ No sponsors found!");
      }
  
      setSponsors(response.data);
    } catch (error) {
      console.error("🔥 Error fetching sponsors:", error.response?.data || error.message);
    }
  };
  
  

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return console.error("No auth token found.");
  
      const response = await axios.get("http://localhost:8000/api/sponsors/my-sponsors", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setApplications(response.data);
    } catch (error) {
      console.error("🔥 Error fetching applied sponsorships:", error.response?.data || error.message);
    }
  };

  const handleApply = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("❌ No auth token found.");
        return;
      }

      if (!selectedSponsor || !amountRequested) {
        console.error("❌ Sponsor ID and Amount Requested are required.");
        return;
      }

      // Fetch the logged-in athlete's ID
      const userResponse = await axios.get("http://localhost:8000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const athleteId = userResponse.data._id;

      // Send the sponsorship application
      await axios.post("http://localhost:8000/api/sponsors/apply", {
        athleteId, // Automatically get the logged-in athlete
        sponsorId: selectedSponsor,
        amountRequested,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAmountRequested(""); // Reset input field
      setSelectedSponsor(""); // Reset selection
      fetchApplications(); // Refresh applied sponsorships
    } catch (error) {
      console.error("🔥 Error applying for sponsorship:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <AthleteNavbar />
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">🏆 Sponsorship Opportunities</h2>

        {/* Sponsorship Application Form */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-2xl font-semibold">Apply for Sponsorship</h3>
          <select
            value={selectedSponsor}
            onChange={(e) => setSelectedSponsor(e.target.value)}
            className="w-full p-2 border rounded mt-2"
          >
            <option value="">Select Sponsor</option>
            {sponsors.length > 0 ? (
              sponsors.map((sponsor) => (
                <option key={sponsor._id} value={sponsor._id}>
                  {sponsor.name}
                </option>
              ))
            ) : (
              <option disabled>No Sponsors Available</option>
            )}
          </select>

          <input
            type="number"
            placeholder="Amount Requested"
            className="w-full p-2 border rounded mt-2"
            value={amountRequested}
            onChange={(e) => setAmountRequested(e.target.value)}
          />
          <button 
            className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700" 
            onClick={handleApply}
          >
            Apply
          </button>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold">📜 My Sponsorship Applications</h2>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-purple-600 text-white">
                <th className="p-3 text-left">Sponsor</th>
                <th className="p-3 text-left">Amount Requested</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app._id} className="border-t border-gray-300">
                    <td className="p-3">{app.sponsor?.name || "Unknown Sponsor"}</td>
                    <td className="p-3">${app.amountRequested}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-sm rounded ${
                        app.status === "Approved" ? "bg-green-500 text-white"
                        : app.status === "Rejected" ? "bg-red-500 text-white"
                        : "bg-gray-500 text-white"
                      }`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-3 text-center text-gray-500">No sponsorships applied yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AthletesSponsorships;

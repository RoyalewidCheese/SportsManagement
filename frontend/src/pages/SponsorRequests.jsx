import { useState, useEffect } from "react";
import axios from "axios";
import SponsorNavbar from "../components/SponsorNavbar";

const SponsorRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("❌ No auth token found.");
        return;
      }

      console.log("📢 Fetching Sponsorship Requests...");

      const response = await axios.get("http://localhost:8000/api/sponsors/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Sponsorship Requests API Response:", response.data);
      setRequests(response.data);
    } catch (error) {
      console.error("🔥 Error fetching sponsorship requests:", error.response?.data || error.message);
    }
  };

  const handleAction = async (requestId, status) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("❌ No auth token found.");
        return;
      }

      console.log(`📢 Updating request ${requestId} to status: ${status}`);

      await axios.put(
        `http://localhost:8000/api/sponsors/requests/${requestId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchRequests();
    } catch (error) {
      console.error(`🔥 Error updating request status to ${status}:`, error.response?.data || error.message);
    }
  };

  return (
    <div>
      <SponsorNavbar />
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">📜 Sponsorship Requests</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="p-3 text-left">Athlete</th>
                <th className="p-3 text-left">Amount Requested</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map((req) => (
                  <tr key={req._id} className="border-t border-gray-300">
                    <td className="p-3">{req.athlete?.name || "Unknown Athlete"}</td>
                    <td className="p-3">${req.amountRequested}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-sm rounded ${
                          req.status === "Approved" ? "bg-green-500 text-white"
                          : req.status === "Rejected" ? "bg-red-500 text-white"
                          : "bg-gray-500 text-white"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                        onClick={() => handleAction(req._id, "Approved")}
                      >
                        ✅ Approve
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleAction(req._id, "Rejected")}
                      >
                        ❌ Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-3 text-center text-gray-500">No sponsorship requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SponsorRequests;

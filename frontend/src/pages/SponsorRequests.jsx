import { useState, useEffect } from "react";
import axios from "axios";
import SponsorNavbar from "../components/SponsorNavbar";

const SponsorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    } catch (error) {
      console.error("🔥 Error fetching sponsorship requests:", error.response?.data || error.message);
      setLoading(false);
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

  // Sample data for demonstration (in case API doesn't return any)
  const sampleRequests = [
    {
      _id: "1",
      athlete: { name: "Emma Smith", sport: "Gymnastics", profileImage: "https://placekitten.com/50/50" },
      amountRequested: 950,
      requestDate: "2025-03-17",
      purpose: "Training equipment and competition fees",
      status: "Pending"
    },
    {
      _id: "2",
      athlete: { name: "Jason Lee", sport: "Soccer", profileImage: "https://placekitten.com/51/51" },
      amountRequested: 1100,
      requestDate: "2025-03-18",
      purpose: "International tournament travel expenses",
      status: "Pending"
    },
    {
      _id: "3",
      athlete: { name: "Maria Gonzalez", sport: "Track & Field", profileImage: "https://placekitten.com/52/52" },
      amountRequested: 850,
      requestDate: "2025-03-15",
      purpose: "Performance gear and coaching fees",
      status: "Approved"
    },
    {
      _id: "4",
      athlete: { name: "Tyrone Jackson", sport: "Basketball", profileImage: "https://placekitten.com/53/53" },
      amountRequested: 1500,
      requestDate: "2025-03-14",
      purpose: "Summer training camp",
      status: "Rejected"
    }
  ];

  // Use sample data if requests array is empty
  const displayRequests = requests.length > 0 ? requests : sampleRequests;

  // Filter requests based on status
  const filteredRequests = filterStatus === "All" 
    ? displayRequests 
    : displayRequests.filter(req => req.status === filterStatus);

  // Sort requests based on date
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const dateA = new Date(a.requestDate || "2025-03-01");
    const dateB = new Date(b.requestDate || "2025-03-01");
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <SponsorNavbar />
      
      <div className="ml-64 p-6"> {/* Adjusted margin for vertical navbar */}
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Sponsorship Requests</h1>
              <p className="text-gray-600 mt-1">Review and manage athlete funding requests</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                {filteredRequests.filter(req => req.status === "Pending").length} Pending
              </div>
            </div>
          </div>
        </div>
        
        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <label className="text-gray-700">Filter by status:</label>
              <select 
                className="border rounded-md p-2 bg-gray-50"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Requests</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="text-gray-700">Sort by:</label>
              <select 
                className="border rounded-md p-2 bg-gray-50"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              
              <button 
                onClick={fetchRequests}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <span className="mr-2">🔄</span> Refresh
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading requests...</p>
              </div>
            </div>
          ) : (
            <>
              {sortedRequests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Athlete</th>
                        <th className="text-left py-3 px-4">Details</th>
                        <th className="text-left py-3 px-4">Amount</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-center py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedRequests.map((req) => (
                        <tr key={req._id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
                                {req.athlete?.profileImage ? (
                                  <img src={req.athlete.profileImage} alt={req.athlete?.name || "Athlete"} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-lg">{(req.athlete?.name || "A").charAt(0)}</span>
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{req.athlete?.name || "Unknown Athlete"}</p>
                                <p className="text-sm text-gray-500">{req.athlete?.sport || "Sport"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-sm">{req.purpose || "Sponsorship request"}</p>
                            <p className="text-xs text-gray-500">{new Date(req.requestDate || Date.now()).toLocaleDateString()}</p>
                          </td>
                          <td className="py-4 px-4 font-medium">${req.amountRequested}</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs ${
                              req.status === "Approved" ? "bg-green-100 text-green-800" :
                              req.status === "Rejected" ? "bg-red-100 text-red-800" :
                              "bg-yellow-100 text-yellow-800"
                            }`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            {req.status === "Pending" ? (
                              <div className="flex justify-center space-x-2">
                                <button
                                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-transform hover:scale-105"
                                  onClick={() => handleAction(req._id, "Approved")}
                                >
                                  Approve
                                </button>
                                <button
                                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-transform hover:scale-105"
                                  onClick={() => handleAction(req._id, "Rejected")}
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <button
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-transform hover:scale-105"
                                onClick={() => handleAction(req._id, "Pending")}
                              >
                                Reset
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-5xl mb-4">📋</div>
                  <h3 className="text-xl font-medium text-gray-700">No requests found</h3>
                  <p className="text-gray-500 mt-2">There are no sponsorship requests matching your filters</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SponsorRequests;
import { useState, useEffect } from "react";
import axios from "axios";
import CouncilNavbar from "../components/CouncilNavbar";

const CouncilApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch applications
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
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
  
      setApplications(response.data);
      setError(null);
    } catch (error) {
      console.error("🔥 Error fetching applications:", error.response?.data || error.message);
      setError("Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
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
        setError("Tournament ID is missing. Cannot update application.");
        return;
      }
  
      await axios.put(`http://localhost:8000/api/applications/${id}`, { 
        status, 
        tournament: tournamentId
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Update the application in the UI immediately
      setApplications(applications.map(app => 
        app._id === id ? { ...app, status } : app
      ));
      
      // Show success message
      setError(`Application ${status.toLowerCase()} successfully`);
      setTimeout(() => setError(null), 3000);
    } catch (error) {
      console.error(`🔥 Error updating application status to ${status}:`, error.response?.data || error.message);
      setError(`Failed to ${status.toLowerCase()} application. Please try again.`);
    }
  };  

  return (
    <div className="flex h-screen bg-gray-100">
      <CouncilNavbar />
      <div className="flex-1 ml-0 md:ml-20 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Tournament Applications</h2>
              <span className="text-sm text-gray-500">
                {applications.length} application{applications.length !== 1 ? 's' : ''}
              </span>
            </div>

            {error && (
              <div className={`mb-4 p-3 rounded-md ${error.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
              </div>
            ) : applications.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Athlete</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tournament</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((app) => (
                      <tr key={app._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-bold">
                                {app.athlete?.name?.charAt(0) || '?'}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{app.athlete?.name || "Unknown Athlete"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{app.tournament?.name || "Unknown Tournament"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span 
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              app.status === "Approved" ? "bg-green-100 text-green-800" 
                              : app.status === "Rejected" ? "bg-red-100 text-red-800" 
                              : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            className="text-green-600 hover:text-green-900 mr-3"
                            onClick={() => handleAction(app._id, "Approved", app.tournament?._id)}
                            disabled={app.status === "Approved"}
                          >
                            Approve
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleAction(app._id, "Rejected", app.tournament?._id)}
                            disabled={app.status === "Rejected"}
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
                <p className="mt-1 text-sm text-gray-500">No applications have been submitted yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouncilApplications;
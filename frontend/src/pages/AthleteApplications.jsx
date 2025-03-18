import { useState, useEffect } from "react";
import axios from "axios";
import { FileText, Trash2, AlertCircle, CheckCircle, XCircle, Loader } from "lucide-react";
import AthleteNavbar from "../components/AthleteNavbar";

const AthleteApplications = () => {
  const [applications, setApplications] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

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
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token || !user) return console.error("No auth token or user found");

      const response = await axios.get("http://localhost:8000/api/applications/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Ensure correct ID comparison
      const filteredApplications = response.data.filter(app => 
        String(app.athlete._id) === String(user._id)
      );
      
      setApplications(filteredApplications);
    } catch (error) {
      console.error("Error fetching applications:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return console.error("No auth token found");
  
      await axios.delete(`http://localhost:8000/api/applications/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setApplications(applications.filter(app => app._id !== applicationId));
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Error deleting application:", error.response?.data || error.message);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "Approved":
        return (
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium text-xs">
            <CheckCircle size={14} />
            <span>Approved</span>
          </div>
        );
      case "Rejected":
        return (
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 font-medium text-xs">
            <XCircle size={14} />
            <span>Rejected</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-medium text-xs">
            <AlertCircle size={14} />
            <span>Pending</span>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <AthleteNavbar />
      <div className="pt-20 md:pl-64 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center text-white shadow-md">
                <FileText size={20} />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                My Applications
              </h1>
            </div>
            <p className="text-indigo-600 ml-1">Track and manage your tournament applications</p>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 overflow-hidden">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-12">
                <Loader size={36} className="text-indigo-400 animate-spin mb-4" />
                <p className="text-indigo-600">Loading your applications...</p>
              </div>
            ) : applications.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-indigo-50 text-indigo-900">
                      <th className="py-3 px-4 text-left font-semibold">Athlete</th>
                      <th className="py-3 px-4 text-left font-semibold">Tournament</th>
                      <th className="py-3 px-4 text-left font-semibold">Location</th>
                      <th className="py-3 px-4 text-left font-semibold">Status</th>
                      <th className="py-3 px-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app._id} className="border-t border-indigo-100 hover:bg-indigo-50 transition-colors">
                        <td className="py-3 px-4">{user?.name || "Unknown Athlete"}</td>
                        <td className="py-3 px-4 font-medium text-indigo-900">{app.tournamentName}</td>
                        <td className="py-3 px-4 text-indigo-700">{app.tournament?.location || "Unknown"}</td>
                        <td className="py-3 px-4">{getStatusBadge(app.status)}</td>
                        <td className="py-3 px-4 text-right">
                          {deleteConfirmId === app._id ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                className="px-3 py-1 rounded-md bg-indigo-100 text-indigo-700 text-sm hover:bg-indigo-200 transition-colors"
                                onClick={() => setDeleteConfirmId(null)}
                              >
                                Cancel
                              </button>
                              <button
                                className="px-3 py-1 rounded-md bg-red-500 text-white text-sm hover:bg-red-600 transition-colors"
                                onClick={() => handleDeleteApplication(app._id)}
                              >
                                Confirm
                              </button>
                            </div>
                          ) : (
                            <button
                              className="p-2 rounded-md hover:bg-red-100 text-red-500 transition-colors"
                              onClick={() => setDeleteConfirmId(app._id)}
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-400 mb-4">
                  <FileText size={24} />
                </div>
                <h3 className="text-lg font-medium text-indigo-900 mb-2">No Applications Yet</h3>
                <p className="text-indigo-600 text-center max-w-md">
                  You haven't applied to any tournaments yet. When you do, they will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AthleteApplications;
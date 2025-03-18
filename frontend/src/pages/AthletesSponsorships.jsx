import { useState, useEffect } from "react";
import axios from "axios";
import { DollarSign, Building, CheckCircle, XCircle, AlertCircle, Loader } from "lucide-react";
import AthleteNavbar from "../components/AthleteNavbar";

const AthletesSponsorships = () => {
  const [sponsors, setSponsors] = useState([]);
  const [applications, setApplications] = useState([]);
  const [amountRequested, setAmountRequested] = useState("");
  const [selectedSponsor, setSelectedSponsor] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchSponsors(), fetchApplications()]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSponsors = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No auth token found.");
        return;
      }
  
      const response = await axios.get("http://localhost:8000/api/sponsors", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setSponsors(response.data);
    } catch (error) {
      console.error("Error fetching sponsors:", error.response?.data || error.message);
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
      console.error("Error fetching applied sponsorships:", error.response?.data || error.message);
    }
  };

  const handleApply = async () => {
    // Reset messages
    setFormError("");
    setSuccessMessage("");
    
    // Validate form
    if (!selectedSponsor) {
      setFormError("Please select a sponsor");
      return;
    }
    
    if (!amountRequested || amountRequested <= 0) {
      setFormError("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setFormError("Authentication error. Please log in again.");
        return;
      }

      // Fetch the logged-in athlete's ID
      const userResponse = await axios.get("http://localhost:8000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const athleteId = userResponse.data._id;

      // Send the sponsorship application
      await axios.post("http://localhost:8000/api/sponsors/apply", {
        athleteId,
        sponsorId: selectedSponsor,
        amountRequested,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Reset form
      setAmountRequested("");
      setSelectedSponsor("");
      
      // Show success message
      setSuccessMessage("Sponsorship application submitted successfully!");
      
      // Refresh applications
      fetchApplications();
    } catch (error) {
      setFormError(error.response?.data?.message || "Failed to submit application. Please try again.");
      console.error("Error applying for sponsorship:", error.response?.data || error.message);
    } finally {
      setIsSubmitting(false);
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
                <DollarSign size={20} />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Sponsorships
              </h1>
            </div>
            <p className="text-indigo-600 ml-1">Apply for sponsorships and track your applications</p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <Loader size={36} className="text-indigo-400 animate-spin mb-4" />
              <p className="text-indigo-600">Loading sponsorship information...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sponsorship Application Form */}
              <div className="md:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <Building size={20} />
                    </div>
                    <h3 className="text-lg font-semibold text-indigo-900">Apply for Sponsorship</h3>
                  </div>
                  
                  {formError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm">
                      {formError}
                    </div>
                  )}
                  
                  {successMessage && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-lg text-green-700 text-sm">
                      {successMessage}
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-indigo-700 mb-1">
                        Select Sponsor
                      </label>
                      <select
                        value={selectedSponsor}
                        onChange={(e) => setSelectedSponsor(e.target.value)}
                        className="w-full p-2.5 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-indigo-900"
                      >
                        <option value="">Select a sponsor</option>
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
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-indigo-700 mb-1">
                        Amount Requested ($)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <DollarSign size={16} className="text-indigo-500" />
                        </div>
                        <input
                          type="number"
                          placeholder="Enter amount"
                          className="w-full p-2.5 pl-10 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-indigo-900"
                          value={amountRequested}
                          onChange={(e) => setAmountRequested(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <button 
                      className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:from-blue-600 hover:to-indigo-700 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                      onClick={handleApply}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader size={16} className="animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : "Apply for Sponsorship"}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Applications Table */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-indigo-100 overflow-hidden">
                  <div className="p-4 border-b border-indigo-100 flex items-center justify-between">
                    <h3 className="font-semibold text-indigo-900">My Sponsorship Applications</h3>
                    <button onClick={fetchApplications} className="text-indigo-600 hover:text-indigo-800 text-sm">
                      Refresh
                    </button>
                  </div>
                  
                  {applications.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-indigo-50 text-indigo-900">
                            <th className="py-3 px-4 text-left font-semibold">Sponsor</th>
                            <th className="py-3 px-4 text-left font-semibold">Amount</th>
                            <th className="py-3 px-4 text-left font-semibold">Status</th>
                            <th className="py-3 px-4 text-left font-semibold">Application Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {applications.map((app) => (
                            <tr key={app._id} className="border-t border-indigo-100 hover:bg-indigo-50 transition-colors">
                              <td className="py-3 px-4 font-medium text-indigo-900">
                                {app.sponsor?.name || "Unknown Sponsor"}
                              </td>
                              <td className="py-3 px-4 text-indigo-700">
                                ${app.amountRequested.toLocaleString()}
                              </td>
                              <td className="py-3 px-4">
                                {getStatusBadge(app.status)}
                              </td>
                              <td className="py-3 px-4 text-indigo-600 text-sm">
                                {new Date(app.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-12">
                      <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-400 mb-4">
                        <DollarSign size={24} />
                      </div>
                      <h3 className="text-lg font-medium text-indigo-900 mb-2">No Applications Yet</h3>
                      <p className="text-indigo-600 text-center max-w-md">
                        You haven't applied for any sponsorships yet. Use the form to submit your first application.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AthletesSponsorships;
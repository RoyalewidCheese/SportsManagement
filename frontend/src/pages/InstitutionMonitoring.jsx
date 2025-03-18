import { useState, useEffect } from "react";
import axios from "axios";
import InstitutionNavbar from "../components/InstitutionNavbar";
import { Link } from "react-router-dom";

const InstitutionMonitoring = () => {
  const [monitoringData, setMonitoringData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample statistics for the dashboard
  const participationStats = {
    totalParticipations: 87,
    activeTournaments: 12,
    medalsWon: 24,
    percentageGrowth: 15
  };

  // Recent tournament results for quick reference
  const recentResults = [
    { id: 1, athlete: "Emma Wilson", tournament: "National Swimming Championship", result: "Gold Medal", date: "Yesterday" },
    { id: 2, athlete: "Michael Chen", tournament: "Regional Basketball Tournament", result: "Semi-finalist", date: "2 days ago" },
    { id: 3, athlete: "Sofia Rodriguez", tournament: "Junior Tennis Open", result: "Silver Medal", date: "3 days ago" },
  ];

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
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <InstitutionNavbar />
        <div className="flex-1 ml-64 p-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Tournament Monitoring</h1>
            <p className="text-gray-600 mt-1">Track your athletes' participation and performance in various tournaments</p>
          </div>

          {/* Stats Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white opacity-90">Total Participations</p>
                  <p className="text-3xl font-bold mt-1">{participationStats.totalParticipations}</p>
                  <p className="text-xs mt-2 opacity-80">+{participationStats.percentageGrowth}% this semester</p>
                </div>
                <div className="text-4xl bg-white bg-opacity-20 p-3 rounded-full">🏆</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white opacity-90">Active Tournaments</p>
                  <p className="text-3xl font-bold mt-1">{participationStats.activeTournaments}</p>
                  <p className="text-xs mt-2 opacity-80">Across 8 different sports</p>
                </div>
                <div className="text-4xl bg-white bg-opacity-20 p-3 rounded-full">🏅</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white opacity-90">Medals Won</p>
                  <p className="text-3xl font-bold mt-1">{participationStats.medalsWon}</p>
                  <p className="text-xs mt-2 opacity-80">10 Gold, 8 Silver, 6 Bronze</p>
                </div>
                <div className="text-4xl bg-white bg-opacity-20 p-3 rounded-full">🥇</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white opacity-90">Upcoming Events</p>
                  <p className="text-3xl font-bold mt-1">7</p>
                  <p className="text-xs mt-2 opacity-80">Next event in 3 days</p>
                </div>
                <div className="text-4xl bg-white bg-opacity-20 p-3 rounded-full">📅</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Table Card */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">📊 Tournament Participation Records</h2>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                  <p className="text-gray-500 mt-4">Loading participation data...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="text-red-500 text-2xl mr-3">⚠️</div>
                    <div>
                      <h3 className="font-medium text-red-800">Error Loading Data</h3>
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                  <button className="mt-3 text-sm text-red-700 hover:text-red-900 font-medium">
                    Try Again
                  </button>
                </div>
              ) : monitoringData.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-4xl mb-4">📋</div>
                  <h3 className="text-lg font-medium text-gray-700">No Records Found</h3>
                  <p className="text-gray-500 mt-1">No tournament participation records available.</p>
                  <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-sm">
                    Register New Participation
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg">
                    <thead>
                      <tr className="bg-purple-600 text-white">
                        <th className="p-3 text-left font-medium">Athlete</th>
                        <th className="p-3 text-left font-medium">Tournament Name</th>
                        <th className="p-3 text-left font-medium">Location</th>
                        <th className="p-3 text-left font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {monitoringData.map((entry) => (
                        <tr key={entry._id} className="hover:bg-gray-50 transition">
                          <td className="p-3">
                            <div className="flex items-center space-x-3">
                              <img
                                src={`http://localhost:8000${entry.athlete.image}`}
                                alt={entry.athlete.name}
                                className="w-10 h-10 object-cover rounded-full border-2 border-purple-200"
                                onError={(e) => (e.target.src = "/default-profile.png")}
                              />
                              <div>
                                <p className="font-medium text-gray-800">{entry.athlete.name}</p>
                                <p className="text-xs text-gray-500">{entry.athlete.admissionNumber}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 font-medium">{entry.tournament.name}</td>
                          <td className="p-3 text-gray-600">{entry.tournament.location}</td>
                          <td className="p-3 text-gray-600">{new Date(entry.tournament.date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                <p>Showing {monitoringData.length} of {monitoringData.length} entries</p>
                <div className="flex space-x-1">
                  <button className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 transition">Previous</button>
                  <button className="px-3 py-1 bg-purple-600 text-white rounded">1</button>
                  <button className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 transition">Next</button>
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Recent Results */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Results</h3>
                <div className="space-y-3">
                  {recentResults.map((result) => (
                    <div key={result.id} className="flex items-center bg-gray-50 rounded-lg p-3 transition hover:bg-gray-100">
                      <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                        {result.athlete.charAt(0)}
                      </div>
                      <div className="ml-3 flex-grow">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-gray-800">{result.athlete}</h4>
                          <span className="bg-yellow-100 text-yellow-800 text-xs py-1 px-2 rounded-full">{result.result}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <p className="text-xs text-gray-500">{result.tournament}</p>
                          <p className="text-xs text-gray-500">{result.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Insights */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Performance Insights</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Swimming</span>
                      <span className="text-sm font-medium text-gray-700">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Basketball</span>
                      <span className="text-sm font-medium text-gray-700">70%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "70%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Tennis</span>
                      <span className="text-sm font-medium text-gray-700">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "92%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Help Card */}
              <div className="bg-purple-50 border-l-4 border-purple-400 p-5 rounded-lg">
                <h4 className="font-semibold text-gray-800">Monitoring Tips</h4>
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  <li>• Export data regularly for records</li>
                  <li>• Track performance across tournaments</li>
                  <li>• Update results within 24 hours</li>
                  <li>• Monitor athlete progress over time</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionMonitoring;
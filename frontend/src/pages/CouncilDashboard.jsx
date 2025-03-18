import { useState, useEffect } from "react";
import CouncilNavbar from "../components/CouncilNavbar";
import { Users, Trophy, FileCheck, Award, ArrowUp, ArrowDown, Activity } from "lucide-react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";

const CouncilDashboard = () => {
  const [stats, setStats] = useState({
    athletes: 0,
    tournaments: 0,
    applications: 0,
    winners: 0
  });
  
  const [recentApplications, setRecentApplications] = useState([]);
  const [upcomingTournaments, setUpcomingTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Function to handle sidebar state
  const handleSidebarToggle = (isOpen) => {
    setSidebarOpen(isOpen);
  };

  // Static data for the application activity chart
  const activityData = [
    { month: "Jan", applications: 15, approvals: 12 },
    { month: "Feb", applications: 20, approvals: 15 },
    { month: "Mar", applications: 25, approvals: 20 },
    { month: "Apr", applications: 30, approvals: 25 },
    { month: "May", applications: 20, approvals: 18 },
    { month: "Jun", applications: 35, approvals: 30 }
  ];

  // Static data for upcoming tournaments
  const staticTournaments = [
    {
      _id: "t1",
      name: "National Championships",
      date: "2025-04-15T10:00:00.000Z",
      location: "Pune, Maharashtra",
      category: "Senior Division"
    },
    {
      _id: "t2",
      name: "Regional Qualifiers",
      date: "2025-03-28T09:00:00.000Z",
      location: "Kollam, Kerala",
      category: "All Categories"
    },
    {
      _id: "t3",
      name: "Youth Tournament",
      date: "2025-04-02T11:00:00.000Z",
      location: "New Delhi, Delhi",
      category: "Under 18"
    }
  ];

  // Static data for recent applications
  const staticApplications = [
    {
      _id: "a1",
      athlete: { name: "John Parker" },
      tournament: { name: "National Championships" },
      createdAt: "2025-03-10T14:32:00.000Z",
      status: "Approved"
    },
    {
      _id: "a2",
      athlete: { name: "Sarah Wilson" },
      tournament: { name: "Regional Qualifiers" },
      createdAt: "2025-03-12T09:15:00.000Z",
      status: "Pending"
    },
    {
      _id: "a3",
      athlete: { name: "Carlos Rodriguez" },
      tournament: { name: "Youth Tournament" },
      createdAt: "2025-03-13T16:45:00.000Z",
      status: "Approved"
    },
    {
      _id: "a4",
      athlete: { name: "Emma Thompson" },
      tournament: { name: "National Championships" },
      createdAt: "2025-03-14T11:20:00.000Z",
      status: "Rejected"
    },
    {
      _id: "a5",
      athlete: { name: "Michael Chen" },
      tournament: { name: "Regional Qualifiers" },
      createdAt: "2025-03-15T13:10:00.000Z",
      status: "Pending"
    }
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        // Attempt to fetch real data
        try {
          // Fetch stats
          const statsRes = await axios.get("http://localhost:8000/api/dashboard/stats", {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Fetch recent applications
          const applicationsRes = await axios.get("http://localhost:8000/api/applications?limit=5", {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Fetch upcoming tournaments
          const tournamentsRes = await axios.get("http://localhost:8000/api/tournaments?upcoming=true&limit=3", {
            headers: { Authorization: `Bearer ${token}` }
          });

          // Update state with fetched data
          setStats(statsRes.data);
          setRecentApplications(applicationsRes.data);
          setUpcomingTournaments(tournamentsRes.data);
        } catch (error) {
          console.error("Error fetching real data, using static data instead:", error);
          // Set static data if API calls fail
          setStats({
            athletes: 245,
            tournaments: 12,
            applications: 38,
            winners: 21
          });
          setRecentApplications(staticApplications);
          setUpcomingTournaments(staticTournaments);
        }
      } catch (error) {
        console.error("Authorization error:", error);
        // Set static data for visualization
        setStats({
          athletes: 245,
          tournaments: 12,
          applications: 38,
          winners: 21
        });
        setRecentApplications(staticApplications);
        setUpcomingTournaments(staticTournaments);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, change, changeType }) => (
    <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${changeType === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {changeType === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              <span className="ml-1">{change}% from last month</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-full bg-purple-100">
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex">
      {/* Sidebar */}
      <CouncilNavbar onToggle={handleSidebarToggle} />

      {/* Main Content - Adjusted margin & transition classes */}
      <div 
        className={`flex-1 p-8 transition-all duration-300 bg-gray-50 min-h-screen ${
          sidebarOpen ? 'ml-72' : 'ml-0 md:ml-64'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Mobile Content Spacer - Prevents content hiding under mobile menu button */}
          <div className="h-14 md:h-0 block md:hidden"></div>
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Council Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back! Here's an overview of your platform.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Total Athletes" 
              value={stats.athletes} 
              icon={<Users size={24} className="text-purple-500" />} 
              change="8.2" 
              changeType="up" 
            />
            <StatCard 
              title="Tournaments" 
              value={stats.tournaments} 
              icon={<Trophy size={24} className="text-purple-500" />} 
              change="4.1" 
              changeType="up" 
            />
            <StatCard 
              title="Applications" 
              value={stats.applications} 
              icon={<FileCheck size={24} className="text-purple-500" />} 
              change="12.5" 
              changeType="up" 
            />
            <StatCard 
              title="Tournament Winners" 
              value={stats.winners} 
              icon={<Award size={24} className="text-purple-500" />} 
              change="2.3" 
              changeType="down" 
            />
          </div>

          {/* Activity Chart and Upcoming Tournaments */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Activity Chart - Takes up 2/3 of the width on large screens */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Application Activity</h2>
                <div className="flex items-center text-purple-500">
                  <Activity size={16} />
                  <span className="ml-1 text-sm">Last 6 months</span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      labelStyle={{ fontWeight: 'bold', color: '#111827' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="applications" 
                      stroke="#8b5cf6" 
                      strokeWidth={2} 
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Applications" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="approvals" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Approvals" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Upcoming Tournaments - Takes up 1/3 of the width on large screens */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Tournaments</h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading tournaments...</p>
                </div>
              ) : upcomingTournaments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingTournaments.map((tournament, index) => (
                    <div key={tournament._id || index} className="flex items-center p-3 rounded-lg hover:bg-purple-50 transition-colors duration-150">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <Trophy size={20} className="text-purple-500" />
                      </div>
                      <div className="ml-3 flex-1">
                        <h3 className="font-medium text-gray-800">{tournament.name}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(tournament.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <span className="bg-purple-50 px-2 py-1 rounded">{tournament.location}</span>
                          <span className="ml-2 bg-gray-50 px-2 py-1 rounded">{tournament.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No upcoming tournaments</p>
                </div>
              )}
              <Link to="/manage/tournaments"><button className="w-full mt-4 text-center text-purple-500 py-2 hover:bg-purple-50 rounded-lg transition-colors duration-150">
                View All Tournaments
              </button> </Link>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Applications</h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading applications...</p>
              </div>
            ) : recentApplications.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Athlete</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tournament</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApplications.map((app, index) => (
                      <tr key={app._id || index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm text-gray-800 font-medium">{app.athlete?.name || "Unknown Athlete"}</td>
                        <td className="px-4 py-4 text-sm text-gray-500">{app.tournament?.name || "Unknown Tournament"}</td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {app.createdAt 
                            ? new Date(app.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                            : "Unknown date"}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            app.status === "Approved" ? "bg-green-100 text-green-800" : 
                            app.status === "Rejected" ? "bg-red-100 text-red-800" : 
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {app.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No recent applications</p>
              </div>
            )}
            <Link to="/manage/applications"><button className="w-full mt-4 text-center text-purple-500 py-2 hover:bg-purple-50 rounded-lg transition-colors duration-150">
              View All Applications
            </button></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouncilDashboard;
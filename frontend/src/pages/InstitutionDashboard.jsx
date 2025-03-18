import { useState, useEffect } from "react";
import axios from "axios";
import SidebarNavbar from "../components/InstitutionNavbar";
import { LineChart, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Bar, ResponsiveContainer } from 'recharts';
import { Link } from "react-router-dom";

const InstitutionDashboard = () => {
  const [stats, setStats] = useState({
    totalAthletes: 0,
    totalTournaments: 0,
    activeParticipations: 0,
    tournamentsWon: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentAthletes, setRecentAthletes] = useState([]);
  
  // Sample performance data for charts
  const performanceData = [
    { month: 'Jan', participants: 20, medals: 5 },
    { month: 'Feb', participants: 25, medals: 8 },
    { month: 'Mar', participants: 30, medals: 12 },
    { month: 'Apr', participants: 35, medals: 10 },
    { month: 'May', participants: 40, medals: 15 },
    { month: 'Jun', participants: 45, medals: 18 },
  ];
  
  // Sample distribution data
  const sportDistribution = [
    { name: 'Football', athletes: 45 },
    { name: 'Basketball', athletes: 30 },
    { name: 'Swimming', athletes: 25 },
    { name: 'Tennis', athletes: 20 },
    { name: 'Track', athletes: 35 }
  ];

  useEffect(() => {
    // Simulate fetching stats
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;
        
        const institutionId = localStorage.getItem("instituteId");
        if (!institutionId) return;
        
        // Fetch athletes count
        const athletesResponse = await axios.get(`http://localhost:8000/api/institutions/${institutionId}/athletes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Enhanced stats with some mock data
        setStats({
          totalAthletes: athletesResponse.data.length,
          totalTournaments: 24,
          activeParticipations: 12,
          tournamentsWon: 8
        });
        
        // Sample recent athletes data
        const sampleAthletes = athletesResponse.data.length > 0 
          ? athletesResponse.data.slice(0, 5) 
          : [
              { _id: 1, name: "Alex Johnson", email: "alex@example.edu", admissionNumber: "ST21001", sport: "Swimming" },
              { _id: 2, name: "Jamie Smith", email: "jamie@example.edu", admissionNumber: "ST21045", sport: "Basketball" },
              { _id: 3, name: "Taylor Wilson", email: "taylor@example.edu", admissionNumber: "ST21062", sport: "Tennis" },
              { _id: 4, name: "Morgan Lee", email: "morgan@example.edu", admissionNumber: "ST21083", sport: "Football" },
              { _id: 5, name: "Casey Brown", email: "casey@example.edu", admissionNumber: "ST21097", sport: "Track" }
            ];
        
        setRecentAthletes(sampleAthletes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Athletes", value: stats.totalAthletes, icon: "🏆", color: "from-blue-600 to-blue-700", trend: "+5% this month" },
    { title: "Active Tournaments", value: stats.totalTournaments, icon: "🏅", color: "from-purple-600 to-purple-700", trend: "+2 this week" },
    { title: "Current Participants", value: stats.activeParticipations, icon: "🎯", color: "from-green-600 to-green-700", trend: "+3 this week" }, 
    { title: "Tournaments Won", value: stats.tournamentsWon, icon: "🥇", color: "from-amber-500 to-amber-600", trend: "+1 this month" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <SidebarNavbar />
        <div className="flex-1 ml-64 p-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Welcome to Institution Hub</h1>
            <p className="text-gray-600 mt-1">Dashboard overview and key metrics</p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card, index) => (
              <div 
                key={index} 
                className={`bg-gradient-to-r ${card.color} rounded-xl shadow-lg p-6 text-white transform transition hover:scale-105`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white opacity-90">{card.title}</p>
                    <p className="text-3xl font-bold mt-1">{loading ? "..." : card.value}</p>
                    <p className="text-xs mt-2 opacity-80">{card.trend}</p>
                  </div>
                  <div className="text-4xl bg-white bg-opacity-20 p-3 rounded-full">{card.icon}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Performance Chart */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Athlete Performance</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="participants" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="medals" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Sport Distribution */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Sport Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={sportDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="athletes" fill="#8884d8" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Recent Athletes and Upcoming Events */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Athletes */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Recent Athletes</h3>
                <Link to="/institution/athletes" className="text-indigo-600 hover:text-indigo-800 text-sm">View All</Link>
              </div>
              
              {loading ? (
                <div className="flex justify-center">
                  <p>Loading recent athletes...</p>
                </div>
              ) : recentAthletes.length === 0 ? (
                <p className="text-gray-500">No athletes registered yet.</p>
              ) : (
                <div className="space-y-4">
                  {recentAthletes.map((athlete) => (
                    <div key={athlete._id} className="flex items-center bg-gray-50 rounded-lg p-4 transition hover:bg-gray-100">
                      <img
                        src={athlete.image ? `http://localhost:8000${athlete.image}` : "/default-profile.png"}
                        alt={athlete.name}
                        className="w-14 h-14 object-cover rounded-full border-2 border-indigo-600 p-1"
                      />
                      <div className="ml-4 flex-grow">
                        <div className="flex justify-between">
                          <h4 className="font-semibold text-gray-800">{athlete.name}</h4>
                          <span className="bg-indigo-100 text-indigo-800 text-xs py-1 px-2 rounded-full">{athlete.sport || "General"}</span>
                        </div>
                        <p className="text-sm text-gray-600">{athlete.email}</p>
                        <div className="flex justify-between mt-1">
                          <p className="text-xs text-gray-500">{athlete.admissionNumber}</p>
                          <p className="text-xs text-gray-500">Joined 2 weeks ago</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Upcoming Events */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <div className="flex justify-between">
                    <h4 className="font-semibold text-gray-800">Regional Basketball Tournament</h4>
                    <span className="text-xs text-gray-500">3 days</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">State Sports Complex, 10 participants</p>
                </div>
                
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                  <div className="flex justify-between">
                    <h4 className="font-semibold text-gray-800">National Swimming Championship</h4>
                    <span className="text-xs text-gray-500">1 week</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Olympic Pool Center, 5 participants</p>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                  <div className="flex justify-between">
                    <h4 className="font-semibold text-gray-800">Track & Field Invitational</h4>
                    <span className="text-xs text-gray-500">2 weeks</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">University Stadium, 8 participants</p>
                </div>
                
                <Link to="/institution/monitor-participation" className="block text-center text-indigo-600 hover:text-indigo-800 text-sm mt-4">
                  View All Events →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDashboard;
import { useState, useEffect } from "react";
import axios from "axios";
import InstitutionNavbar from "../components/InstitutionNavbar";

const InstitutionDashboard = () => {
  const [stats, setStats] = useState({
    totalAthletes: 0,
    totalTournaments: 0,
    activeParticipations: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentAthletes, setRecentAthletes] = useState([]);

  useEffect(() => {
    // Simulate fetching stats (replace with actual API calls)
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
        
        // For demonstration, we'll use some mock data for other stats
        setStats({
          totalAthletes: athletesResponse.data.length,
          totalTournaments: 12,
          activeParticipations: 8
        });
        
        // Get most recent athletes
        setRecentAthletes(athletesResponse.data.slice(0, 5));
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Athletes", value: stats.totalAthletes, icon: "🏆", color: "from-blue-500 to-blue-600" },
    { title: "Total Tournaments", value: stats.totalTournaments, icon: "🏅", color: "from-purple-500 to-purple-600" },
    { title: "Active Participations", value: stats.activeParticipations, icon: "🎯", color: "from-green-500 to-green-600" }
  ];

  const quickLinks = [
    { title: "Register New Athlete", href: "/institution/register-athlete", icon: "📝", color: "bg-blue-600" },
    { title: "View All Athletes", href: "/institution/athletes", icon: "👥", color: "bg-purple-600" },
    { title: "Monitor Participation", href: "/institution/monitor-participation", icon: "📊", color: "bg-green-600" }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <InstitutionNavbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-700 to-purple-700 rounded-lg shadow-xl p-6 mb-8 text-white">
          <h2 className="text-3xl font-bold">Welcome to Institution Hub</h2>
          <p className="mt-2 text-indigo-100">Manage your athletes, tournaments, and track participation all in one place.</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statCards.map((card, index) => (
            <div key={index} className={`bg-gradient-to-r ${card.color} rounded-lg shadow-lg p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-medium text-white opacity-80">{card.title}</p>
                  <p className="text-3xl font-bold mt-1">{loading ? "..." : card.value}</p>
                </div>
                <div className="text-4xl">{card.icon}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {quickLinks.map((link, index) => (
                  <a 
                    key={index} 
                    href={link.href} 
                    className={`flex items-center p-3 rounded-lg ${link.color} text-white hover:opacity-90 transition duration-200`}
                  >
                    <span className="text-xl mr-3">{link.icon}</span>
                    <span>{link.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          {/* Recent Athletes */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Athletes</h3>
              
              {loading ? (
                <div className="flex justify-center">
                  <p>Loading recent athletes...</p>
                </div>
              ) : recentAthletes.length === 0 ? (
                <p className="text-gray-500">No athletes registered yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentAthletes.map((athlete) => (
                    <div key={athlete._id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200">
                      <img
                        src={athlete.image ? `http://localhost:8000${athlete.image}` : "/default-profile.png"}
                        alt={athlete.name}
                        className="w-12 h-12 object-cover rounded-full mr-4 border-2 border-indigo-500"
                      />
                      <div className="flex-grow">
                        <h4 className="font-semibold text-gray-800">{athlete.name}</h4>
                        <p className="text-sm text-gray-600">{athlete.email}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {athlete.admissionNumber}
                      </div>
                    </div>
                  ))}
                  
                  <a 
                    href="/institution/athletes" 
                    className="block text-center text-indigo-600 hover:underline mt-4"
                  >
                    View All Athletes →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDashboard;
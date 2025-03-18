import { useState, useEffect } from "react";
import SponsorNavbar from "../components/SponsorNavbar";
import axios from "axios";
import { Link } from "react-router-dom"
const SponsorDashboard = () => {
  const [currentMonth, setCurrentMonth] = useState("March");
  const [loading, setLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(true);
  
  // Sample data for dashboard cards and charts
  const statsData = [
    { label: "Active Sponsorships", value: 12, icon: "🤝", color: "bg-blue-500", trend: "+2 this month" },
    { label: "Pending Requests", value: 5, icon: "⏳", color: "bg-yellow-500", trend: "3 new today" },
    { label: "Monthly Budget", value: "$15,000", icon: "💵", color: "bg-green-500", trend: "70% allocated" },
    { label: "Athletes Supported", value: 8, icon: "🏆", color: "bg-purple-500", trend: "2 new sign-ups" }
  ];
  
  const recentActivities = [
    { id: 1, type: "Approval", athlete: "John Doe", amount: "$2,000", date: "Mar 01, 2025", status: "Approved" },
    { id: 2, type: "Rejection", athlete: "Emma Johnson", amount: "$1,200", date: "Mar 03, 2025", status: "Rejected" },
    { id: 3, type: "Pending", athlete: "Carlos Mendes", amount: "$900", date: "Mar 07, 2025", status: "Pending" },
    { id: 4, type: "Approval", athlete: "Lisa Rodriguez", amount: "$1,500", date: "Mar 10, 2025", status: "Approved" },
    { id: 5, type: "Approval", athlete: "Sophia Patel", amount: "$2,500", date: "Mar 12, 2025", status: "Approved" },
    { id: 6, type: "Rejection", athlete: "David Kim", amount: "$750", date: "Mar 14, 2025", status: "Rejected" },
    { id: 7, type: "Pending", athlete: "Ava Martinez", amount: "$1,100", date: "Mar 16, 2025", status: "Pending" },
    { id: 8, type: "Approval", athlete: "Liam Carter", amount: "$3,000", date: "Mar 18, 2025", status: "Approved" },
    { id: 9, type: "Pending", athlete: "Ethan Nguyen", amount: "$850", date: "Mar 20, 2025", status: "Pending" },
    { id: 10, type: "Rejection", athlete: "Olivia Thompson", amount: "$1,600", date: "Mar 22, 2025", status: "Rejected" },
  ];
  
  const upcomingEvents = [
    { id: 1, name: "Regional Track Championship", date: "Mar 25, 2025", location: "City Stadium", athletes: 3 },
    { id: 2, name: "Swimming Nationals", date: "Apr 02, 2025", location: "Aquatic Center", athletes: 2 },
    { id: 3, name: "College Basketball Finals", date: "Apr 10, 2025", location: "Sports Arena", athletes: 1 },
    { id: 4, name: "State Basketball Semi-Finals", date: "Apr 12, 2025", location: "Sports Arena", athletes: 5 }
  ];

  const sponsorshipPerformance = [
    { athlete: "Michael Johnson", roi: 3.2, medals: 5, mediaMentions: 12 },
    { athlete: "Sarah Williams", roi: 2.8, medals: 3, mediaMentions: 8 },
    { athlete: "David Chen", roi: 3.5, medals: 4, mediaMentions: 15 },
  ];

  const sportCategories = [
    { name: "Track & Field", percentage: 40, color: "bg-blue-400" },
    { name: "Swimming", percentage: 25, color: "bg-green-400" },
    { name: "Basketball", percentage: 20, color: "bg-yellow-400" },
    { name: "Other", percentage: 15, color: "bg-purple-400" }
  ];

  useEffect(() => {
    // Simulating API fetch for pending requests
    setLoading(true);
    setTimeout(() => {
      setPendingRequests([
        { id: 1, athlete: "Emma Smith", amount: "$950", sport: "Gymnastics", date: "Mar 17, 2025" },
        { id: 2, athlete: "Jason Lee", amount: "$1,100", sport: "Soccer", date: "Mar 18, 2025" }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <SponsorNavbar />
      
      <div className="ml-64 p-6"> {/* Adjusted margin for vertical navbar */}
        {/* Header with Welcome Message */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Welcome Back, Sponsors!</h1>
              <p className="text-gray-600 mt-1">Here's your sponsorship overview for {currentMonth}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                Premium Sponsor
              </div>
              <select 
                className="border rounded-md p-2 bg-gray-50"
                value={currentMonth}
                onChange={(e) => setCurrentMonth(e.target.value)}
              >
                <option>January</option>
                <option>February</option>
                <option>March</option>
                <option>April</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {statsData.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.trend}</p>
                </div>
                <div className={`${stat.color} text-white p-4 rounded-full text-2xl`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Alert for Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  You have {pendingRequests.length} pending sponsorship requests that require your attention.
                </p>
                <div className="mt-2">
                  <a href="/sponsor/requests" className="text-sm font-medium text-yellow-700 hover:text-yellow-600 underline">
                    View all requests →
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">📋</span>Recent Activities
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Athlete</th>
                    <th className="text-left py-3 px-2">Amount</th>
                    <th className="text-left py-3 px-2">Date</th>
                    <th className="text-left py-3 px-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities.map((activity) => (
                    <tr key={activity.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium">{activity.athlete}</td>
                      <td className="py-3 px-2">{activity.amount}</td>
                      <td className="py-3 px-2 text-gray-500">{activity.date}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          activity.status === "Approved" ? "bg-green-100 text-green-800" :
                          activity.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                          "bg-blue-100 text-blue-800"
                        }`}>
                          {activity.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <Link to="http://localhost:5173/sponsor/requests"><button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
                View All Activities
              </button></Link>
            </div>
          </div>
          
          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">🗓️</span>Upcoming Events
            </h2>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="border-b pb-4 last:border-0">
                  <h3 className="font-medium">{event.name}</h3>
                  <div className="text-sm text-gray-500 mt-1">
                    <div className="flex items-center">
                      <span className="mr-1">📅</span>
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="mr-1">📍</span>
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="mr-1">🏃</span>
                      <span>{event.athletes} sponsored athletes participating</span>
                    </div>
                  </div>
                  <button className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">
                    View Details
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
            </div>
          </div>
        </div>
        
        {/* Additional Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ROI & Performance */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">📈</span>Sponsorship Performance
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Athlete</th>
                    <th className="text-left py-3 px-2">ROI</th>
                    <th className="text-left py-3 px-2">Medals</th>
                    <th className="text-left py-3 px-2">Media Mentions</th>
                  </tr>
                </thead>
                <tbody>
                  {sponsorshipPerformance.map((athlete, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium">{athlete.athlete}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          athlete.roi > 3.0 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {athlete.roi}x
                        </span>
                      </td>
                      <td className="py-3 px-2">{athlete.medals} 🏅</td>
                      <td className="py-3 px-2">{athlete.mediaMentions} 📰</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Sponsorship Categories */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">📊</span>Sponsorship Distribution
            </h2>
            <div className="space-y-4">
              {sportCategories.map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span>{category.name}</span>
                    <span>{category.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`${category.color} h-2.5 rounded-full`} 
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorDashboard;
import { useState, useEffect } from "react";
import axios from "axios";
import ApplyModal from "../components/AthleteModal";
import { 
  CalendarDays, 
  MapPin, 
  Award, 
  TrendingUp, 
  Clock, 
  Users, 
  Trophy,
  ChevronRight, 
  ArrowUp, 
  Star,
  Filter,
  Search
} from "lucide-react";
import AthleteNavbar from "../components/AthleteNavbar";

const AthletesDashboard = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [stats, setStats] = useState({
    upcomingCount: 0,
    appliedCount: 0,
    totalPrizes: 0,
    winRate: 68
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch tournaments
        const res = await axios.get("http://localhost:8000/api/tournaments");
        const today = new Date();
        const upcomingTournaments = res.data.filter(
          (tournament) => new Date(tournament.date) > today
        );
        setTournaments(upcomingTournaments);
        
        // Get token for authenticated requests
        const token = localStorage.getItem("authToken");
        if (token) {
          // Fetch application count
          const applicationsRes = await axios.get(
            "http://localhost:8000/api/applications/my",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          // Set stats
          setStats({
            upcomingCount: upcomingTournaments.length,
            appliedCount: applicationsRes.data.length,
            totalPrizes: upcomingTournaments.reduce((sum, t) => sum + (t.prizePool || 0), 0),
            winRate: 68 // Example static value
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const handleApplyClick = (tournament) => {
    setSelectedTournament(tournament);
    setShowModal(true);
  };

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tournament.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterCategory === "all") return matchesSearch;
    
    // Add more filter categories as needed
    if (filterCategory === "highPrize") return matchesSearch && tournament.prizePool > 5000;
    if (filterCategory === "local") return matchesSearch && tournament.location.includes("local");
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pl-0 md:pl-64 pt-0"> 
      <AthleteNavbar />
      
      {/* Main content */}
      <div className="p-6 pt-8 md:p-8 mt-8">
        {/* Welcome Section with Search */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 border border-indigo-50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-indigo-900">Welcome back, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">John Doe</span></h1>
              <p className="text-indigo-600 mt-1">Discover and apply to upcoming tournaments</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tournaments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-indigo-800 w-full md:w-64"
                />
                <Search className="absolute left-3 top-2.5 text-indigo-300" size={18} />
              </div>
              <div className="relative">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="appearance-none pl-10 pr-8 py-2 rounded-lg border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-indigo-800"
                >
                  <option value="all">All tournaments</option>
                  <option value="highPrize">High Prize</option>
                  <option value="local">Local Events</option>
                </select>
                <Filter className="absolute left-3 top-2.5 text-indigo-300" size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatCard 
            title="Upcoming Tournaments" 
            value={stats.upcomingCount} 
            icon={<CalendarDays size={22} />} 
            color="bg-gradient-to-br from-blue-50 to-indigo-100"
            iconColor="text-blue-500"
            textColor="text-blue-700"
            accentColor="border-blue-200"
          />
          <StatCard 
            title="My Applications" 
            value={stats.appliedCount} 
            icon={<FileIcon size={22} />} 
            color="bg-gradient-to-br from-purple-50 to-indigo-100"
            iconColor="text-indigo-500"
            textColor="text-indigo-700"
            accentColor="border-indigo-200"
          />
          <StatCard 
            title="Total Prize Pool" 
            value={`$${stats.totalPrizes.toLocaleString()}`} 
            icon={<Award size={22} />} 
            color="bg-gradient-to-br from-emerald-50 to-teal-100"
            iconColor="text-emerald-500"
            textColor="text-emerald-700"
            accentColor="border-emerald-200"
          />
          <StatCard 
            title="Win Rate" 
            value={`${stats.winRate}%`} 
            icon={<TrendingUp size={22} />}
            badge={<span className="text-xs flex items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded"><ArrowUp size={12} className="mr-0.5" /> 12%</span>}
            color="bg-gradient-to-br from-amber-50 to-orange-100"
            iconColor="text-amber-500"
            textColor="text-amber-700"
            accentColor="border-amber-200"
          />
        </div>

        {/* Tournaments Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-50 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-indigo-900 flex items-center">
              <Trophy size={22} className="mr-2 text-indigo-500" /> 
              Upcoming Tournaments
            </h2>
            <Link to="/athletes/tournaments" className="text-indigo-600 text-sm font-medium flex items-center hover:text-indigo-800">
              View all <ChevronRight size={16} />
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTournaments.length > 0 ? (
                filteredTournaments.map((tournament) => (
                  <TournamentCard 
                    key={tournament._id} 
                    tournament={tournament}
                    onApply={() => handleApplyClick(tournament)}
                  />
                ))
              ) : (
                <div className="col-span-3 bg-indigo-50 rounded-xl p-8 text-center">
                  <div className="inline-block p-3 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                    <Search size={24} />
                  </div>
                  <h3 className="text-lg font-medium text-indigo-800 mb-2">No tournaments found</h3>
                  <p className="text-indigo-600">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recommendations/Featured Section */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 shadow-md text-white">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Star size={22} className="mr-2" /> 
            Featured Tournament
          </h2>
          
          <div className="bg-white bg-opacity-10 rounded-xl p-5 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3 rounded-lg overflow-hidden">
                <img 
                  src="https://t3.ftcdn.net/jpg/03/07/31/90/360_F_307319038_3SRdPsHlODULjELT7IxywYu72kXrmlRf.jpg" 
                  alt="Featured Tournament" 
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold mb-2">International Championship 2025</h3>
                  <span className="bg-yellow-500 text-indigo-900 px-3 py-1 rounded-full text-sm font-bold">
                    $25,000
                  </span>
                </div>
                <div className="flex items-center gap-4 mb-3 text-black">
                  <div className="flex items-center">
                    <CalendarDays size={16} className="mr-1" /> 
                    <span>April 15, 2025</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-1" /> 
                    <span>Kolkata, West Bengal</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1" /> 
                    <span>7 days left</span>
                  </div>
                </div>
                <p className="mb-4 text-blue-800">
                  Join the most prestigious athletic competition with participants from over 45 countries. Showcase your skills and compete for the grand prize.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-blue-300 border-2 border-indigo-600"></div>
                      <div className="w-8 h-8 rounded-full bg-indigo-300 border-2 border-indigo-600"></div>
                      <div className="w-8 h-8 rounded-full bg-purple-300 border-2 border-indigo-600"></div>
                    </div>
                    <span className="ml-2 text-black text-sm">+120 applied</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showModal && (
        <ApplyModal 
          showModal={showModal} 
          setShowModal={setShowModal} 
          tournament={selectedTournament} 
        />
      )}
    </div>
  );
};

// Helper components
const StatCard = ({ title, value, badge, icon, color, iconColor, textColor, accentColor }) => (
  <div className={`p-5 rounded-xl shadow-sm ${color} border ${accentColor}`}>
    <div className="flex justify-between items-start mb-3">
      <div className={`p-2 rounded-lg ${iconColor} bg-white bg-opacity-70`}>
        {icon}
      </div>
      {badge && badge}
    </div>
    <div>
      <p className="text-sm font-medium text-indigo-600 mb-1">{title}</p>
      <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
    </div>
  </div>
);

const FileIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);

const Link = ({ to, children, className }) => (
  <a href={to} className={className}>
    {children}
  </a>
);

const TournamentCard = ({ tournament, onApply }) => {
  const tournamentDate = new Date(tournament.date).toLocaleDateString('en-US', {
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  });
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-indigo-50 group">
      <div className="h-40 overflow-hidden relative">
        <img
          src={tournament.image || "https://via.placeholder.com/300x200"}
          alt={tournament.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 to-transparent opacity-60"></div>
        {tournament.prizePool && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-indigo-900 px-3 py-1 rounded-full text-sm font-bold shadow-md">
            ${tournament.prizePool.toLocaleString()}
          </div>
        )}
        <h3 className="absolute bottom-3 left-3 font-bold text-xl text-white shadow-text">{tournament.name}</h3>
      </div>
      
      <div className="p-4">
        <div className="flex items-center text-indigo-700 gap-4 mb-3">
          <div className="flex items-center text-sm">
            <CalendarDays size={14} className="mr-1 text-indigo-500" /> 
            <span>{tournamentDate}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin size={14} className="mr-1 text-indigo-500" /> 
            <span>{tournament.location}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center text-xs text-indigo-500">
            <Users size={14} className="mr-1" />
            <span>42 athletes</span>
          </div>
          
          <button
            onClick={onApply}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-md transition flex items-center text-sm font-medium"
          >
            <span>Apply</span>
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AthletesDashboard;
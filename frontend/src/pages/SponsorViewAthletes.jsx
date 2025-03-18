import { useState, useEffect } from "react";
import axios from "axios";
import SponsorNavbar from "../components/SponsorNavbar";

const SponsorViewAthletes = () => {
  const [institutions, setInstitutions] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [athletes, setAthletes] = useState([]);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSport, setFilterSport] = useState("All");
  const [sortOrder, setSortOrder] = useState("nameAsc");

  // Sample sports list
  const sportsList = ["All", "Track & Field", "Swimming", "Basketball", "Soccer", "Gymnastics", "Tennis"];

  useEffect(() => {
    fetchInstitutions();
  }, []);

  // Fetch Institutions (Schools/Colleges)
  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/institutions");
      setInstitutions(response.data);
      setLoading(false);
    } catch (error) {
      console.error("🔥 Error fetching institutions:", error.response?.data || error.message);
      setLoading(false);
    }
  };

  // Fetch Athletes by Institution
  const fetchAthletes = async (institutionId) => {
    if (!institutionId) return;

    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8000/api/institutions/${institutionId}/athletes`);
      setAthletes(res.data);
      setLoading(false);
    } catch (error) {
      console.error("🔥 Error fetching athletes:", error.response?.data || error.message);
      setLoading(false);
      // Set sample data if API fails
      setSampleAthletes();
    }
  };

  // Sample athletes data
  const setSampleAthletes = () => {
    setAthletes([
      {
        _id: "1",
        name: "Michael Johnson",
        admissionNumber: "A12345",
        sport: "Track & Field",
        achievements: [
          { _id: "a1", tournament: { name: "Regional Championship" }, position: "1st", awardTitle: "Gold Medal", prizeAmount: 1000, createdAt: "2025-01-15" },
          { _id: "a2", tournament: { name: "State Finals" }, position: "2nd", awardTitle: "Silver Medal", prizeAmount: 500, createdAt: "2024-11-22" }
        ],
        image: "/images/athlete1.jpg",
        bio: "National record holder in 200m sprint.",
        age: 20,
        performanceMetrics: { speed: 95, endurance: 88, technique: 92 },
        upcomingEvents: ["State Championship", "National Qualifiers"],
        createdAt: "2023-09-15"
      },
      {
        _id: "2",
        name: "Sarah Williams",
        admissionNumber: "B67890",
        sport: "Swimming",
        achievements: [
          { _id: "b1", tournament: { name: "State Swimming Championship" }, position: "1st", awardTitle: "Gold Medal", prizeAmount: 1200, createdAt: "2025-02-10" }
        ],
        image: "/images/athlete2.jpg",
        bio: "Specializes in butterfly and freestyle events.",
        age: 19,
        performanceMetrics: { speed: 90, endurance: 94, technique: 91 },
        upcomingEvents: ["National Swimming Championship"],
        createdAt: "2023-10-05"
      },
      {
        _id: "3",
        name: "David Chen",
        admissionNumber: "C54321",
        sport: "Basketball",
        achievements: [
          { _id: "c1", tournament: { name: "Interstate Basketball Tournament" }, position: "1st", awardTitle: "MVP", prizeAmount: 1500, createdAt: "2025-01-20" }
        ],
        image: "/images/athlete3.jpg",
        bio: "Point guard with exceptional court vision.",
        age: 21,
        performanceMetrics: { speed: 88, endurance: 85, technique: 96 },
        upcomingEvents: ["College Basketball Finals"],
        createdAt: "2023-11-12"
      },
      {
        _id: "4",
        name: "Emma Rodriguez",
        admissionNumber: "D98765",
        sport: "Gymnastics",
        achievements: [
          { _id: "d1", tournament: { name: "National Gymnastics Meet" }, position: "3rd", awardTitle: "Bronze Medal", prizeAmount: 800, createdAt: "2024-12-05" }
        ],
        image: "/images/athlete4.jpg",
        bio: "Floor exercise and balance beam specialist.",
        age: 18,
        performanceMetrics: { speed: 86, endurance: 82, technique: 98 },
        upcomingEvents: ["Regional Gymnastics Competition"],
        createdAt: "2024-01-20"
      },
      {
        _id: "5",
        name: "Carlos Martinez",
        admissionNumber: "E13579",
        sport: "Soccer",
        achievements: [
          { _id: "e1", tournament: { name: "State Soccer Cup" }, position: "1st", awardTitle: "Golden Boot", prizeAmount: 1000, createdAt: "2025-02-25" }
        ],
        image: "/images/athlete5.jpg",
        bio: "Leading goal scorer for his college team.",
        age: 20,
        performanceMetrics: { speed: 92, endurance: 90, technique: 88 },
        upcomingEvents: ["College Soccer Championship"],
        createdAt: "2023-08-30"
      },
      {
        _id: "6",
        name: "Olivia Taylor",
        admissionNumber: "F24680",
        sport: "Tennis",
        achievements: [
          { _id: "f1", tournament: { name: "Regional Tennis Open" }, position: "2nd", awardTitle: "Silver Medal", prizeAmount: 700, createdAt: "2025-01-05" }
        ],
        image: "/images/athlete6.jpg",
        bio: "Known for powerful serves and baseline play.",
        age: 19,
        performanceMetrics: { speed: 89, endurance: 87, technique: 93 },
        upcomingEvents: ["College Tennis Championship"],
        createdAt: "2023-12-10"
      }
    ]);
  };

  // Filter and sort athletes
  const filteredAndSortedAthletes = () => {
    let filtered = [...athletes];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(athlete => 
        athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        athlete.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sport filter
    if (filterSport !== "All") {
      filtered = filtered.filter(athlete => athlete.sport === filterSport);
    }
    
    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortOrder) {
        case "nameAsc":
          return a.name.localeCompare(b.name);
        case "nameDesc":
          return b.name.localeCompare(a.name);
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        default:
          return 0;
      }
    });
  };

  // Calculate statistics
  const stats = {
    totalAthletes: athletes.length,
    sportDistribution: athletes.reduce((acc, athlete) => {
      acc[athlete.sport] = (acc[athlete.sport] || 0) + 1;
      return acc;
    }, {}),
    achievementsCount: athletes.reduce((sum, athlete) => sum + (athlete.achievements?.length || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SponsorNavbar />
      
      <div className="ml-64 p-6"> {/* Adjusted margin for vertical navbar */}
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Athlete Directory</h1>
              <p className="text-gray-600 mt-1">Discover and connect with potential sponsorship candidates</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                {athletes.length} Athletes
              </div>
              <select 
                className="border rounded-md p-2 bg-gray-50"
                value={selectedInstitution}
                onChange={(e) => {
                  setSelectedInstitution(e.target.value);
                  fetchAthletes(e.target.value);
                }}
              >
                <option value="">Select Institution</option>
                {institutions.map((inst) => (
                  <option key={inst._id} value={inst._id}>
                    {inst.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Athletes</p>
                <p className="text-2xl font-bold mt-1">{stats.totalAthletes}</p>
                <p className="text-xs text-gray-500 mt-1">From {institutions.length} institutions</p>
              </div>
              <div className="bg-blue-500 text-white p-4 rounded-full text-2xl">
                🏃
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Sports Categories</p>
                <p className="text-2xl font-bold mt-1">{Object.keys(stats.sportDistribution).length}</p>
                <p className="text-xs text-gray-500 mt-1">Most popular: {Object.entries(stats.sportDistribution).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"}</p>
              </div>
              <div className="bg-green-500 text-white p-4 rounded-full text-2xl">
                🏆
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Achievements</p>
                <p className="text-2xl font-bold mt-1">{stats.achievementsCount}</p>
                <p className="text-xs text-gray-500 mt-1">Across all athletes</p>
              </div>
              <div className="bg-purple-500 text-white p-4 rounded-full text-2xl">
                🏅
              </div>
            </div>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <label className="text-gray-700">Filter by sport:</label>
              <select 
                className="border rounded-md p-2 bg-gray-50"
                value={filterSport}
                onChange={(e) => setFilterSport(e.target.value)}
              >
                {sportsList.map((sport) => (
                  <option key={sport} value={sport}>
                    {sport}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="text-gray-700">Sort by:</label>
              <select 
                className="border rounded-md p-2 bg-gray-50"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="nameAsc">Name (A-Z)</option>
                <option value="nameDesc">Name (Z-A)</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search by name or ID..."
                className="border rounded-md p-2 bg-gray-50 w-60"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                Search
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
                <p className="mt-4 text-gray-600">Loading athletes...</p>
              </div>
            </div>
          ) : (
            <>
              {selectedInstitution ? (
                filteredAndSortedAthletes().length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAndSortedAthletes().map((athlete) => (
                      <div key={athlete._id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-24 relative">
                          <div className="absolute -bottom-8 left-6">
                            <div className="w-16 h-16 rounded-full bg-white border-2 border-white overflow-hidden">
                              <img
                                src={`http://localhost:8000${athlete.image}`}
                                alt={athlete.name}
                                className="w-full h-full object-cover"
                                onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="pt-10 px-6 pb-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-bold">{athlete.name}</h3>
                              <p className="text-gray-600 text-sm">{athlete.sport}</p>
                            </div>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                              {athlete.achievements?.length || 0} Achievements
                            </span>
                          </div>
                          <div className="mt-4">
                            <p className="text-gray-500 text-sm mb-2">
                              <span className="font-medium">ID:</span> {athlete.admissionNumber}
                            </p>
                            {athlete.bio && (
                              <p className="text-gray-500 text-sm mb-2">
                                {athlete.bio.substring(0, 100)}{athlete.bio.length > 100 ? "..." : ""}
                              </p>
                            )}
                            {athlete.upcomingEvents && athlete.upcomingEvents.length > 0 && (
                              <p className="text-gray-500 text-sm">
                                <span className="font-medium">Next Event:</span> {athlete.upcomingEvents[0]}
                              </p>
                            )}
                          </div>
                          <div className="mt-4 flex justify-between items-center">
                            <button
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                              onClick={() => setSelectedAthlete(athlete)}
                            >
                              View Profile
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-5xl mb-4">🔍</div>
                    <h3 className="text-xl font-medium text-gray-700">No athletes found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-5xl mb-4">🏫</div>
                  <h3 className="text-xl font-medium text-gray-700">Select an institution</h3>
                  <p className="text-gray-500 mt-2">Choose an institution from the dropdown above to view athletes</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Athlete Details Modal */}
      {selectedAthlete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-90vh overflow-y-auto">
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-32"></div>
              <button
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                onClick={() => setSelectedAthlete(null)}
              >
                <span className="text-gray-600 text-xl">×</span>
              </button>
              <div className="absolute -bottom-16 left-8">
                <div className="w-32 h-32 rounded-full bg-white border-4 border-white overflow-hidden">
                  <img
                    src={`http://localhost:8000${selectedAthlete.image}`}
                    alt={selectedAthlete.name}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-20 px-8 pb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold">{selectedAthlete.name}</h2>
                  <p className="text-gray-600">{selectedAthlete.sport}</p>
                </div>
                <div className="flex space-x-2">
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Personal Details</h3>
                  <div className="space-y-3">
                    <p className="flex items-center">
                      <span className="font-medium w-32">ID:</span> 
                      <span>{selectedAthlete.admissionNumber}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium w-32">Age:</span> 
                      <span>{selectedAthlete.age || "Not specified"}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium w-32">Joined:</span> 
                      <span>{new Date(selectedAthlete.createdAt).toLocaleDateString()}</span>
                    </p>
                    {selectedAthlete.bio && (
                      <div>
                        <span className="font-medium">Bio:</span> 
                        <p className="mt-1 text-gray-600">{selectedAthlete.bio}</p>
                      </div>
                    )}
                  </div>
                  
                  {selectedAthlete.performanceMetrics && (
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold mb-4">Performance Metrics</h3>
                      <div className="space-y-3">
                        {Object.entries(selectedAthlete.performanceMetrics).map(([key, value]) => (
                          <div key={key}>
                            <div className="flex justify-between mb-1">
                              <span className="capitalize">{key}</span>
                              <span>{value}/100</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-blue-500 h-2.5 rounded-full" 
                                style={{ width: `${value}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Achievements</h3>
                  {selectedAthlete.achievements?.length > 0 ? (
                    <div className="space-y-4">
                      {selectedAthlete.achievements.map((achievement) => (
                        <div key={achievement._id} className="border-l-4 border-green-500 pl-4 py-2">
                          <h4 className="font-semibold">{achievement.tournament.name}</h4>
                          <p className="text-gray-600 text-sm">
                            {achievement.position} Place • {achievement.awardTitle}
                          </p>
                          <div className="flex items-center mt-1 text-sm">
                            <span className="text-green-600 font-medium">${achievement.prizeAmount}</span>
                            <span className="mx-2">•</span>
                            <span className="text-gray-500">{new Date(achievement.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No achievements recorded yet.</p>
                  )}
                  
                  {selectedAthlete.upcomingEvents && selectedAthlete.upcomingEvents.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
                      <ul className="space-y-2">
                        {selectedAthlete.upcomingEvents.map((event, index) => (
                          <li key={index} className="flex items-center">
                            <span className="mr-2">🗓️</span>
                            <span>{event}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2"
                  onClick={() => setSelectedAthlete(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SponsorViewAthletes;
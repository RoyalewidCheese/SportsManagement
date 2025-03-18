import { useState, useEffect } from "react";
import axios from "axios";
import { Search, AlertCircle, Edit, Trash2, Filter, Calendar, MapPin, Trophy } from "lucide-react";

const AdminTournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editTournament, setEditTournament] = useState(null);
  const [updatedData, setUpdatedData] = useState({ name: "", date: "", location: "", image: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [locationFilter, setLocationFilter] = useState("all");
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchTournaments();
  }, []);

  // Extract unique locations from tournaments data
  useEffect(() => {
    if (tournaments.length > 0) {
      const uniqueLocations = [...new Set(tournaments
        .filter(tournament => tournament.location)
        .map(tournament => tournament.location))];
      setLocations(uniqueLocations);
    }
  }, [tournaments]);

  // Fetch Tournaments
  const fetchTournaments = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Unauthorized. Please log in again.");
        return;
      }

      const response = await axios.get("http://localhost:8000/api/tournaments", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTournaments(response.data);
      setFilteredTournaments(response.data);
      setError(null);
    } catch (error) {
      setError("Failed to load tournaments. Please try again.");
      console.error("Error fetching tournaments:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search and filter
  useEffect(() => {
    let result = [...tournaments];
    
    // Apply location filter
    if (locationFilter !== "all") {
      result = result.filter(tournament => 
        tournament.location === locationFilter
      );
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((tournament) => {
        const name = tournament.name?.toLowerCase() || "";
        const location = tournament.location?.toLowerCase() || "";
  
        return (
          name.includes(query) ||
          location.includes(query)
        );
      });
    }
    
    setFilteredTournaments(result);
  }, [searchQuery, tournaments, locationFilter]);

  // Handle Edit Tournament
  const handleEditClick = (tournament) => {
    setEditTournament({
      id: tournament._id,
      name: tournament.name,
      date: tournament.date.split("T")[0], // Format date correctly
      location: tournament.location,
      image: tournament.image
    });
  };

  const handleUpdateTournament = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Unauthorized. Please log in again.");
        return;
      }
  
      const updatedTournament = {
        name: editTournament.name,
        date: editTournament.date,
        location: editTournament.location,
        image: editTournament.image,
      };
  
      await axios.put(`http://localhost:8000/api/admin/tournaments/${editTournament.id}`, updatedTournament, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
  
      setEditTournament(null);
      fetchTournaments();
    } catch (error) {
      setError("Failed to update tournament. Please try again.");
      console.error("Error updating tournament:", error.response?.data || error.message);
    }
  };

  // Handle Delete Tournament
  const handleDeleteTournament = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return setError("Unauthorized. Please log in again.");
  
      if (!window.confirm("Are you sure you want to delete this tournament?")) return;
  
      await axios.delete(`http://localhost:8000/api/tournaments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      fetchTournaments();
    } catch (error) {
      setError("Failed to delete tournament. Please try again.");
      console.error("Error deleting tournament:", error.response?.data || error.message);
    }
  };

  // Format date to display nicely
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-4">
      {/* Error display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
          <div className="flex items-center">
            <AlertCircle size={20} className="text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Search and filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tournaments by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter size={18} className="mr-2" />
            <span>Filter</span>
          </button>
          
          {filterOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
              <div className="p-4">
                <h3 className="font-medium mb-2">Location</h3>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="all">All Locations</option>
                  {locations.map((location, index) => (
                    <option key={index} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              <div className="border-t border-gray-200 p-2 text-right">
                <button 
                  onClick={() => {
                    setLocationFilter("all");
                    setFilterOpen(false);
                  }}
                  className="px-4 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Reset
                </button>
                <button 
                  onClick={() => setFilterOpen(false)}
                  className="px-4 py-1 text-sm bg-blue-500 text-white rounded ml-2"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Tournament stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="text-lg font-medium text-blue-700">Total Tournaments</h3>
              <p className="text-3xl font-bold text-blue-800">{tournaments.length}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <h3 className="text-lg font-medium text-orange-700">Locations</h3>
              <p className="text-3xl font-bold text-orange-800">{locations.length}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h3 className="text-lg font-medium text-purple-700">Filtered Tournaments</h3>
              <p className="text-3xl font-bold text-purple-800">{filteredTournaments.length}</p>
            </div>
          </div>

          {/* Tournaments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.length > 0 ? (
              filteredTournaments.map((tournament) => (
                <div key={tournament._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col">
                  <div className="h-40 relative">
                    <img 
                      className="w-full h-full object-cover" 
                      src={tournament.image.startsWith("http") ? tournament.image : `http://localhost:8000${tournament.image}`}
                      alt={tournament.name}
                      onError={(e) => (e.target.src = "/default-tournament.png")}
                    />
                    <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 m-2 rounded-full text-xs">
                      {formatDate(tournament.date)}
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg text-gray-800 mb-2 flex items-center">
                      <Trophy size={18} className="mr-2 text-yellow-500" />
                      {tournament.name}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Calendar size={16} className="mr-2" />
                      <span>{formatDate(tournament.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin size={16} className="mr-2" />
                      <span>{tournament.location}</span>
                    </div>
                  </div>
                  <div className="p-4 pt-0 mt-auto flex justify-between">
                    <button
                      className="flex items-center text-blue-600 hover:text-blue-800 px-3 py-1 rounded-md bg-blue-50 hover:bg-blue-100"
                      onClick={() => handleEditClick(tournament)}
                    >
                      <Edit size={16} className="mr-1" />
                      Edit
                    </button>
                    <button
                      className="flex items-center text-red-600 hover:text-red-800 px-3 py-1 rounded-md bg-red-50 hover:bg-red-100"
                      onClick={() => handleDeleteTournament(tournament._id)}
                    >
                      <Trash2 size={16} className="mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                <Trophy size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No tournaments found matching your search criteria.</p>
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Edit Tournament Modal */}
      {editTournament && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center">
              <Trophy size={20} className="text-yellow-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Edit Tournament</h3>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tournament Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editTournament.name}
                  onChange={(e) => setEditTournament({ ...editTournament, name: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editTournament.date}
                  onChange={(e) => setEditTournament({ ...editTournament, date: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editTournament.location}
                  onChange={(e) => setEditTournament({ ...editTournament, location: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editTournament.image}
                  onChange={(e) => setEditTournament({ ...editTournament, image: e.target.value })}
                />
              </div>
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Preview</label>
                <div className="mt-1 border border-gray-200 rounded-md overflow-hidden h-40">
                  <img 
                    src={editTournament.image} 
                    alt="Tournament" 
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = "/default-tournament.png")}
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 mr-3"
                onClick={() => setEditTournament(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                onClick={handleUpdateTournament}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTournaments;
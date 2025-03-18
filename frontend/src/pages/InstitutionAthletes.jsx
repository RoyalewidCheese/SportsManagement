import React, { useState, useEffect } from "react";
import axios from "axios";
import InstitutionNavbar from "../components/InstitutionNavbar";

const ViewAthletes = () => {
  const [athletes, setAthletes] = useState([]);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const athletesPerPage = 6;
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Sample sports for filtering
  const sports = ["All", "Football", "Basketball", "Swimming", "Tennis", "Track", "Volleyball", "Gymnastics"];

  useEffect(() => {
    fetchAthletes();
  }, []);

  // ✅ Fetch athletes from institution
  const fetchAthletes = async () => {
    try {
      setLoading(true);
      console.log("📡 Fetching athletes...");
  
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("❌ Unauthorized. Please log in again.");
        return;
      }
  
      const institutionId = localStorage.getItem("instituteId");
      if (!institutionId) {
        alert("❌ Institution ID not found. Please re-login.");
        return;
      }
  
      console.log(`🔹 Fetching athletes for institution: ${institutionId}`);
  
      const response = await axios.get(`http://localhost:8000/api/institutions/${institutionId}/athletes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("✅ Athletes Retrieved:", response.data);
      
      // Add sports if not present for demo purposes
      const athletesWithSports = response.data.map(athlete => {
        if (!athlete.sport) {
          const randomSport = sports[Math.floor(Math.random() * (sports.length - 1)) + 1];
          return { ...athlete, sport: randomSport };
        }
        return athlete;
      });
      
      setAthletes(athletesWithSports);
      setLoading(false);
    } catch (error) {
      console.error("🔥 Error fetching athletes:", error.response?.data || error.message);
      setLoading(false);
    }
  };  

  // ✅ Select an athlete for details
  const handleAthleteClick = (athlete) => {
    console.log("👀 Selected Athlete:", athlete);
    setSelectedAthlete(athlete);
  };

  // ✅ Edit Athlete
  const handleEditAthlete = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return alert("Unauthorized. Please log in again.");
  
      if (!editData || !editData._id) {
        console.error("❌ No athlete selected for editing.");
        return;
      }
  
      console.log(`🔄 Updating athlete ID: ${editData._id}`);
  
      const response = await axios.put(
        `http://localhost:8000/api/institutions/athletes/${editData._id}`, 
        editData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("✅ Athlete updated:", response.data);
  
      setEditData(null);
      setSelectedAthlete(null);
      fetchAthletes(); // Refresh data
    } catch (error) {
      console.error("🔥 Error updating athlete:", error.response?.data || error.message);
    }
  };
  
  // ✅ Delete Athlete
  const handleDeleteAthlete = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Unauthorized. Please log in again.");
        return;
      }

      if (!window.confirm("Are you sure you want to delete this athlete?")) return;

      console.log(`🗑 Deleting athlete: ${id}`);
      await axios.delete(`http://localhost:8000/api/institutions/athletes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Athlete deleted successfully!");
      setAthletes((prevAthletes) => prevAthletes.filter((athlete) => athlete._id !== id));
      setSelectedAthlete(null);
    } catch (error) {
      console.error("🔥 Error deleting athlete:", error.response?.data || error.message);
    }
  };

  // ✅ Filter athletes
  const filteredAthletes = athletes.filter(athlete =>
    athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    athlete.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  // ✅ Pagination logic
  const indexOfLastAthlete = currentPage * athletesPerPage;
  const indexOfFirstAthlete = indexOfLastAthlete - athletesPerPage;
  const currentAthletes = filteredAthletes.slice(indexOfFirstAthlete, indexOfLastAthlete);
  const totalPages = Math.ceil(filteredAthletes.length / athletesPerPage);

  // ✅ Get athlete card background color based on sport


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <InstitutionNavbar />
        <div className="flex-1 ml-64 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Athlete Management</h1>
            <p className="text-gray-600 mt-1">View, edit, and manage your institution's athletes</p>
          </div>
          
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white opacity-90">Total Athletes</p>
                  <p className="text-3xl font-bold mt-1">{athletes.length}</p>
                </div>
                <div className="text-4xl bg-white bg-opacity-20 p-3 rounded-full">🏆</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white opacity-90">Active Athletes</p>
                  <p className="text-3xl font-bold mt-1">{Math.floor(athletes.length * 0.85)}</p>
                </div>
                <div className="text-4xl bg-white bg-opacity-20 p-3 rounded-full">🏃</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white opacity-90">Tournaments Joined</p>
                  <p className="text-3xl font-bold mt-1">{Math.floor(athletes.length * 0.6)}</p>
                </div>
                <div className="text-4xl bg-white bg-opacity-20 p-3 rounded-full">🏅</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white opacity-90">Medals Won</p>
                  <p className="text-3xl font-bold mt-1">{Math.floor(athletes.length * 0.4)}</p>
                </div>
                <div className="text-4xl bg-white bg-opacity-20 p-3 rounded-full">🥇</div>
              </div>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="md:w-1/2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search athletes by name or ID..."
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">🔍</span>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
          
          {/* Athletes Grid */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Athletes Directory</h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-lg text-gray-600">Loading athletes...</p>
              </div>
            ) : filteredAthletes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-lg text-gray-600">No athletes found matching your search</p>
                <button 
                  onClick={() => {
                    setSearchTerm("");
                    setFilterSport("");
                  }}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentAthletes.map((athlete) => (
                  <div
                    key={athlete._id}
                    className={` p-4 rounded-lg shadow-md border-2 hover:shadow-lg transition transform hover:scale-105 cursor-pointer`}
                    onClick={() => handleAthleteClick(athlete)}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={athlete.image ? `http://localhost:8000${athlete.image}` : "/default-profile.png"}
                        alt={athlete.name}
                        className="w-16 h-16 object-cover rounded-full border-2 border-white"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{athlete.name}</h3>
                        <p className="text-sm text-gray-600">{athlete.admissionNumber}</p>
                        <div className="flex items-center mt-1">
                          <span className="ml-2 text-xs text-gray-500">
                            {athlete.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {!loading && filteredAthletes.length > 0 && (
              <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
                <div className="text-sm text-gray-600 mb-4 md:mb-0">
                  Showing {indexOfFirstAthlete + 1} to {Math.min(indexOfLastAthlete, filteredAthletes.length)} of {filteredAthletes.length} athletes
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-lg border ${
                      currentPage === 1 
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" 
                        : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => (
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ))
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="text-gray-500">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 flex items-center justify-center rounded-full ${
                            currentPage === page
                              ? "bg-blue-600 text-white" 
                              : "bg-white text-blue-600 border border-blue-300 hover:bg-blue-50"
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))
                  }
                  
                  <button
                    onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-lg border ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" 
                        : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Athlete Detail Modal */}
      {selectedAthlete && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      {/* Top banner with sport color */}
      <div className="relative w-full">
        <button
          className="absolute top-4 right-4 bg-white rounded-full p-2 text-gray-600 hover:text-gray-900"
          onClick={() => setSelectedAthlete(null)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Profile Section */}
      <div className="px-6 pt-10 pb-4 flex flex-col items-center">
        <img
          src={selectedAthlete.image ? `http://localhost:8000${selectedAthlete.image}` : "/default-profile.png"}
          alt={selectedAthlete.name}
          className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg"
        />
        <h2 className="text-2xl font-bold text-gray-800 mt-4">{selectedAthlete.name}</h2>
        <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mt-2">
          {selectedAthlete.sport || "General"}
        </div>
      </div>

      {/* Athlete Details */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-800">{selectedAthlete.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Admission Number</p>
            <p className="font-medium text-gray-800">{selectedAthlete.admissionNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Joined</p>
            <p className="font-medium text-gray-800">March 15, 2025</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium text-green-600">Active</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
            onClick={() => setEditData(selectedAthlete)}
          >
            Edit Profile
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md"
            onClick={() => handleDeleteAthlete(selectedAthlete._id)}
          >
            Delete Athlete
          </button>
        </div>
      </div>
    </div>
  </div>
)}


      {/* ✅ Edit Athlete Modal */}
      {editData && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Edit Athlete Profile</h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setEditData(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  value={editData.name} 
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })} 
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  value={editData.email} 
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })} 
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Admission Number</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  value={editData.admissionNumber} 
                  onChange={(e) => setEditData({ ...editData, admissionNumber: e.target.value })} 
                />
              </div>
              

            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <button 
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                onClick={() => setEditData(null)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleEditAthlete}
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

export default ViewAthletes;
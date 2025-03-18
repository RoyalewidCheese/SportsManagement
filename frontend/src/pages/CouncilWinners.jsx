import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import CouncilNavbar from "../components/CouncilNavbar";
import Select from "react-select";

const CouncilWinners = () => {
  const [winners, setWinners] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedWinner, setSelectedWinner] = useState(null);
  const [formData, setFormData] = useState({ 
    tournament: "", 
    athlete: "", 
    position: "1st", 
    prizeAmount: "", 
    awardTitle: "" 
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchWinners(),
          fetchTournaments(),
          fetchAthletes()
        ]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      showError("Session expired. Please log in again.");
      return null;
    }
    return token;
  };

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 5000);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  // Fetch Winners List
  const fetchWinners = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/winners");
      setWinners(res.data);
      return res.data;
    } catch (error) {
      console.error("Error fetching winners:", error);
      showError("Failed to load winners. Please try again.");
      return [];
    }
  };

  // Fetch All Tournaments
  const fetchTournaments = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/tournaments");
      setTournaments(res.data);
      return res.data;
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      showError("Failed to load tournaments. Please try again.");
      return [];
    }
  };

  // Fetch All Athletes
  const fetchAthletes = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/users?role=Athlete");
      setAthletes(res.data);
      return res.data;
    } catch (error) {
      console.error("Error fetching athletes:", error.response?.data || error.message);
      showError("Failed to load athletes. Please try again.");
      return [];
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Athlete Selection
  const handleAthleteSelect = (selectedOption) => {
    setFormData({ ...formData, athlete: selectedOption.value });
  };

  // Assign Winner
  const handleAssignWinner = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    
    const token = getToken();
    if (!token) return;

    try {
      await axios.post("http://localhost:8000/api/winners/add", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      });

      await fetchWinners();
      setFormData({ tournament: "", athlete: "", position: "1st", prizeAmount: "", awardTitle: "" });
      showSuccess("Winner assigned successfully!");
    } catch (error) {
      const errorMsg = error.response?.data?.msg || "Failed to assign winner.";
      showError(errorMsg);
      console.error("Error assigning winner:", errorMsg);
    }
  };

  // Remove Winner
  const handleRemoveWinner = async () => {
    if (!selectedWinner) return;
    
    const token = getToken();
    if (!token) return;

    try {
      await axios.delete(`http://localhost:8000/api/winners/${selectedWinner._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setWinners((prevWinners) => prevWinners.filter(winner => winner._id !== selectedWinner._id));
      setSelectedWinner(null);
      showSuccess("Winner removed successfully.");
    } catch (error) {
      console.error("Error removing winner:", error.response?.data || error.message);
      showError("Failed to remove winner. Please try again.");
    }
  };

  // Custom styles for react-select
  const selectStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: '0.375rem',
      borderColor: '#e5e7eb',
      padding: '2px',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#6366f1',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#eff6ff' : 'white',
      color: '#1f2937',
      '&:hover': {
        backgroundColor: '#eff6ff',
      },
    }),
  };

  const positionBadge = (position) => {
    const colors = {
      "1st": "bg-yellow-100 text-yellow-800 border-yellow-300",
      "2nd": "bg-gray-100 text-gray-800 border-gray-300",
      "3rd": "bg-amber-100 text-amber-800 border-amber-300",
    };
    
    return colors[position] || "bg-blue-100 text-blue-800 border-blue-300";
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <CouncilNavbar />
      
      <main className="flex-1 p-4 md:p-8 md:ml-64">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Winner Management</h1>
            <p className="text-gray-500 mt-1">Assign and manage tournament winners</p>
          </div>

          {/* Notification Area */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 rounded-md bg-red-50 border-l-4 border-red-500 flex items-center"
              >
                <div className="flex-shrink-0 h-5 w-5 mr-3 text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-red-700">{errorMessage}</span>
              </motion.div>
            )}
            
            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 rounded-md bg-green-50 border-l-4 border-green-500 flex items-center"
              >
                <div className="flex-shrink-0 h-5 w-5 mr-3 text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-green-700">{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Assign Winner Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-lg font-medium text-gray-800">Assign Winner</h2>
                </div>
                <form onSubmit={handleAssignWinner} className="p-6 space-y-4">
                  {/* Tournament Selection */}
                  <div>
                    <label htmlFor="tournament" className="block text-sm font-medium text-gray-700 mb-1">
                      Tournament <span className="text-red-500">*</span>
                    </label>
                    <select 
                      id="tournament"
                      name="tournament" 
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                      value={formData.tournament} 
                      onChange={handleChange} 
                      required
                    >
                      <option value="">Select Tournament</option>
                      {tournaments.map((tournament) => (
                        <option key={tournament._id} value={tournament._id}>
                          {tournament.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Athlete Selection */}
                  <div>
                    <label htmlFor="athlete" className="block text-sm font-medium text-gray-700 mb-1">
                      Athlete <span className="text-red-500">*</span>
                    </label>
                    <Select
                      id="athlete"
                      options={athletes.map(athlete => ({ 
                        value: athlete._id, 
                        label: athlete.name 
                      }))}
                      onChange={handleAthleteSelect}
                      placeholder="Search and select athlete"
                      styles={selectStyles}
                      className="w-full"
                    />
                  </div>

                  {/* Position Selection */}
                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                      Position <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-3">
                      {["1st", "2nd", "3rd"].map((pos) => (
                        <label key={pos} className="flex-1">
                          <input
                            type="radio"
                            name="position"
                            value={pos}
                            checked={formData.position === pos}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className={`text-center py-2 px-3 rounded-md border cursor-pointer transition ${
                            formData.position === pos
                              ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}>
                            {pos}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Prize Amount */}
                  <div>
                    <label htmlFor="prizeAmount" className="block text-sm font-medium text-gray-700 mb-1">
                      Prize Amount ($) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        id="prizeAmount"
                        name="prizeAmount"
                        className="w-full border border-gray-300 rounded-md shadow-sm py-2 pl-7 pr-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="0.00"
                        value={formData.prizeAmount}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Award Title */}
                  <div>
                    <label htmlFor="awardTitle" className="block text-sm font-medium text-gray-700 mb-1">
                      Award Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="awardTitle"
                      name="awardTitle"
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="e.g., Gold Medal Champion"
                      value={formData.awardTitle}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Assign Winner
                    </button>
                </form>
              </div>
            </div>

            {/* Winners List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-800">Winners List</h2>
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {winners.length} total
                  </span>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
                      <p className="mt-3 text-sm text-gray-500">Loading winners...</p>
                    </div>
                  </div>
                ) : winners.length === 0 ? (
                  <div className="text-center py-16">
                    <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">No winners assigned yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4 p-6">
                    {winners.map((winner) => (
                      <motion.div
                        key={winner._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center p-4">
                          <div className="relative">
                            <img
                              src={winner.athlete?.image ? `http://localhost:8000${winner.athlete.image}` : "/default-avatar.png"}
                              alt={winner.athlete?.name || "Winner"}
                              className="h-16 w-16 rounded-full object-cover border-2 border-indigo-100"
                            />
                            <div className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center ${
                              winner.position === "1st" ? "bg-yellow-400" :
                              winner.position === "2nd" ? "bg-gray-300" :
                              "bg-amber-600"
                            }`}>
                              <span className="text-xs font-bold text-white">{winner.position.charAt(0)}</span>
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                              {winner.athlete?.name || "Unknown Athlete"}
                            </h3>
                            <div className="flex flex-col mt-1">
                              <span className="text-sm text-gray-600 line-clamp-1">
                                {winner.tournament?.name || "Unknown Tournament"}
                              </span>
                              <span className={`text-xs font-medium mt-1 px-2 py-0.5 rounded-full inline-flex items-center w-fit ${positionBadge(winner.position)}`}>
                                {winner.position} Place
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedWinner(winner)}
                            className="ml-2 p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                          >
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Winner Details Modal */}
      <AnimatePresence>
        {selectedWinner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full"
            >
              <div className="relative">
                {/* Header with background gradient */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-28"></div>
                
                {/* Profile image overlapping gradient */}
                <div className="absolute left-0 right-0 -bottom-16 flex justify-center">
                  <div className="relative">
                    <img
                      src={selectedWinner.athlete?.image ? `http://localhost:8000${selectedWinner.athlete.image}` : "/default-avatar.png"}
                      alt={selectedWinner.athlete?.name || "Winner"}
                      className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md"
                    />
                    <div className={`absolute bottom-0 right-0 h-8 w-8 rounded-full flex items-center justify-center border-2 border-white ${
                      selectedWinner.position === "1st" ? "bg-yellow-400" :
                      selectedWinner.position === "2nd" ? "bg-gray-300" :
                      "bg-amber-600"
                    }`}>
                      <span className="text-sm font-bold text-white">{selectedWinner.position.charAt(0)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="pt-20 px-6 pb-6">
                <h2 className="text-2xl font-bold text-gray-800 text-center">{selectedWinner.athlete?.name}</h2>
                <p className="text-gray-500 text-center mb-6">{selectedWinner.awardTitle}</p>
                
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-md">
                    <svg className="h-5 w-5 text-indigo-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">Tournament</p>
                      <p className="text-sm font-medium text-gray-800">{selectedWinner.tournament?.name || "Unknown Tournament"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 rounded-md">
                    <svg className="h-5 w-5 text-indigo-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">Prize Amount</p>
                      <p className="text-sm font-medium text-gray-800">${selectedWinner.prizeAmount}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 rounded-md">
                    <svg className="h-5 w-5 text-indigo-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">Position</p>
                      <p className="text-sm font-medium text-gray-800">{selectedWinner.position} Place</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedWinner(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleRemoveWinner}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg className="h-4 w-4 mr-1.5 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove Winner
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CouncilWinners;
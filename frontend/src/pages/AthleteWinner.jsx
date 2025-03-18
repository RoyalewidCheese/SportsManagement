import { useState, useEffect } from "react";
import axios from "axios";
import { Trophy, MapPin, Award, DollarSign, X } from "lucide-react";
import AthleteNavbar from "../components/AthleteNavbar";

const AthleteWinners = () => {
  const [winners, setWinners] = useState([]);
  const [selectedWinner, setSelectedWinner] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const winnersPerPage = 6;

  useEffect(() => {
    fetchWinners();
  }, []);

  const fetchWinners = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/winners");
      setWinners(res.data);
    } catch (error) {
      console.error("Error fetching winners:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate Pagination
  const indexOfLastWinner = currentPage * winnersPerPage;
  const indexOfFirstWinner = indexOfLastWinner - winnersPerPage;
  const currentWinners = winners.slice(indexOfFirstWinner, indexOfLastWinner);
  const totalPages = Math.ceil(winners.length / winnersPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <AthleteNavbar />
      <div className="pt-20 md:pl-64 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center text-white shadow-md">
                <Trophy size={20} />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Winners
              </h1>
            </div>
            <p className="text-indigo-600 ml-1">Browse and discover tournament winners and their achievements</p>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Winners Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentWinners.map((winner) => (
                  <div 
                    key={winner._id} 
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-indigo-50 flex flex-col items-center cursor-pointer"
                    onClick={() => setSelectedWinner(winner)}
                  >
                    <div className="relative mb-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-300 to-indigo-400 flex items-center justify-center text-white text-xl font-medium shadow overflow-hidden">
                        {winner.athlete?.image ? (
                          <img 
                            src={`http://localhost:8000${winner.athlete.image}`} 
                            alt={winner.athlete?.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          winner.athlete?.name?.charAt(0) || "A"
                        )}
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center text-white shadow-md border-2 border-white">
                        <Trophy size={14} />
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-lg text-indigo-900">{winner.athlete?.name || "Unknown Athlete"}</h3>
                    <p className="text-indigo-600 text-sm mb-2">{winner.tournament?.name || "Unknown Tournament"}</p>
                    
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-medium">
                      <Award size={12} />
                      <span>{winner.position || "Winner"}</span>
                    </div>
                    
                    <button className="mt-4 w-full py-2 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium hover:from-blue-600 hover:to-indigo-700 transition-all shadow-sm">
                      View Details
                    </button>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {winners.length === 0 && (
                <div className="flex flex-col items-center justify-center bg-white rounded-xl p-10 shadow-sm border border-indigo-50">
                  <Trophy size={48} className="text-indigo-200 mb-4" />
                  <h3 className="text-xl font-semibold text-indigo-900 mb-2">No Winners Yet</h3>
                  <p className="text-indigo-600 text-center max-w-md">
                    There are no tournament winners available at the moment. Check back later for updates!
                  </p>
                </div>
              )}
              
              {/* Pagination Controls */}
              {winners.length > 0 && (
                <div className="flex justify-center items-center mt-8 mb-12">
                  <div className="flex items-center bg-white rounded-lg shadow-sm border border-indigo-50 overflow-hidden">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={`px-4 py-2 text-sm font-medium ${
                        currentPage === 1 
                          ? "text-indigo-300 cursor-not-allowed" 
                          : "text-indigo-600 hover:bg-indigo-50"
                      }`}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center px-4 border-l border-r border-indigo-100">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => page === 1 || page === totalPages || 
                                (page >= currentPage - 1 && page <= currentPage + 1))
                        .map((page, index, array) => (
                          <div key={page} className="flex items-center">
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <span className="mx-1 text-indigo-400">...</span>
                            )}
                            <button
                              onClick={() => setCurrentPage(page)}
                              className={`w-8 h-8 flex items-center justify-center rounded-full mx-1 text-sm ${
                                currentPage === page
                                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium"
                                  : "text-indigo-600 hover:bg-indigo-50"
                              }`}
                            >
                              {page}
                            </button>
                          </div>
                        ))}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => 
                        indexOfLastWinner < winners.length ? prev + 1 : prev
                      )}
                      className={`px-4 py-2 text-sm font-medium ${
                        indexOfLastWinner >= winners.length 
                          ? "text-indigo-300 cursor-not-allowed" 
                          : "text-indigo-600 hover:bg-indigo-50"
                      }`}
                      disabled={indexOfLastWinner >= winners.length}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Winner Details Modal */}
      {selectedWinner && (
        <div className="fixed inset-0 bg-indigo-900 bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 text-white relative">
              <button 
                onClick={() => setSelectedWinner(null)}
                className="absolute right-4 top-4 text-white hover:text-indigo-100 transition-colors"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-semibold">Winner Details</h2>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-300 to-indigo-400 flex items-center justify-center text-white text-xl font-medium shadow overflow-hidden">
                  {selectedWinner.athlete?.image ? (
                    <img 
                      src={`http://localhost:8000${selectedWinner.athlete.image}`} 
                      alt={selectedWinner.athlete?.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    selectedWinner.athlete?.name?.charAt(0) || "A"
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-indigo-900">{selectedWinner.athlete?.name}</h3>
                  <p className="text-indigo-600 text-sm">{selectedWinner.tournament?.name}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Position */}
                <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Trophy size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-indigo-500">Position</p>
                    <p className="font-medium text-indigo-900">{selectedWinner.position}</p>
                  </div>
                </div>
                
                {/* Prize */}
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <DollarSign size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-blue-500">Prize Amount</p>
                    <p className="font-medium text-blue-900">${selectedWinner.prizeAmount}</p>
                  </div>
                </div>
                
                {/* Award */}
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <Award size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-amber-500">Award Title</p>
                    <p className="font-medium text-amber-900">{selectedWinner.awardTitle}</p>
                  </div>
                </div>
                
                {/* Location */}
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-500">Location</p>
                    <p className="font-medium text-emerald-900">{selectedWinner.tournament?.location || "N/A"}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => setSelectedWinner(null)}
                  className="py-2 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:from-blue-600 hover:to-indigo-700 transition-all shadow-sm"
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

export default AthleteWinners;
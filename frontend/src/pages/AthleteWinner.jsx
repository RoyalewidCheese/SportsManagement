import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select"; // ✅ Import for searchable dropdown
import AthleteNavbar from "../components/AthleteNavbar";

const AthleteWinners = () => {
  const [winners, setWinners] = useState([]);
  const [selectedWinner, setSelectedWinner] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const winnersPerPage = 6; // ✅ Limit to 6 per page

  useEffect(() => {
    fetchWinners();
  }, []);

  // ✅ Fetch Winners List
  const fetchWinners = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/winners");
      setWinners(res.data);
    } catch (error) {
      console.error("🔥 Error fetching winners:", error);
    }
  };

  // ✅ Calculate Pagination
  const indexOfLastWinner = currentPage * winnersPerPage;
  const indexOfFirstWinner = indexOfLastWinner - winnersPerPage;
  const currentWinners = winners.slice(indexOfFirstWinner, indexOfLastWinner);

  return (
    <div className="min-h-screen bg-gray-100">
      <AthleteNavbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center">🏆 Winners</h1>

        {/* Winners List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {currentWinners.map((winner) => (
            <div key={winner._id} className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
              <img 
                src={`http://localhost:8000${winner.athlete?.image}`} 
                alt={winner.athlete?.name || "Winner"} 
                className="w-24 h-24 object-cover rounded-full mb-3 border-2 border-purple-600"
              />
              <h3 className="text-xl font-bold">{winner.athlete?.name || "Unknown Athlete"}</h3>
              <p className="text-gray-600">{winner.tournament?.name || "Unknown Tournament"}</p>
              <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                onClick={() => setSelectedWinner(winner)}>
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
            disabled={currentPage === 1}
          >
            ⬅️ Previous
          </button>
          <span className="text-gray-700 font-semibold">Page {currentPage} of {Math.ceil(winners.length / winnersPerPage)}</span>
          <button
            onClick={() => setCurrentPage(prev => (indexOfLastWinner < winners.length ? prev + 1 : prev))}
            className={`px-4 py-2 rounded ${indexOfLastWinner >= winners.length ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
            disabled={indexOfLastWinner >= winners.length}
          >
            Next ➡️
          </button>
        </div>
      </div>

      {/* Winner Details Modal */}
      {selectedWinner && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold">{selectedWinner.athlete?.name}</h2>
            <p className="text-gray-600">🏆 Position: {selectedWinner.position}</p>
            <p className="text-gray-600">💰 Prize: ${selectedWinner.prizeAmount}</p>
            <p className="text-gray-600">🏅 Award: {selectedWinner.awardTitle}</p>
            <p className="text-gray-600">🎖️ Tournament: {selectedWinner.tournament?.name}</p>
            <p className="text-gray-600">📍 Location: {selectedWinner.tournament?.location || "N/A"}</p>

            <div className="mt-4 flex justify-end">
              <button className="bg-gray-400 text-white px-4 py-2 rounded-lg" onClick={() => setSelectedWinner(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AthleteWinners;

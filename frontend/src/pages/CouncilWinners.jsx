import { useState, useEffect } from "react";
import axios from "axios";
import CouncilNavbar from "../components/CouncilNavbar";
import Select from "react-select";

const CouncilWinners = () => {
  const [winners, setWinners] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // 🔴 Store error message
  const [selectedWinner, setSelectedWinner] = useState(null);
  const [formData, setFormData] = useState({ tournament: "", athlete: "", position: "1st", prizeAmount: "", awardTitle: "" });

  useEffect(() => {
    fetchWinners();
    fetchTournaments();
    fetchAthletes();
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

  // ✅ Fetch All Tournaments
  const fetchTournaments = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/tournaments");
      setTournaments(res.data);
    } catch (error) {
      console.error("🔥 Error fetching tournaments:", error);
    }
  };

  // ✅ Fetch All Athletes
  const fetchAthletes = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/users?role=Athlete");
      setAthletes(res.data);
    } catch (error) {
      console.error("🔥 Error fetching athletes:", error.response?.data || error.message);
    }
  };

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Athlete Selection (From Searchable Dropdown)
  const handleAthleteSelect = (selectedOption) => {
    setFormData({ ...formData, athlete: selectedOption.value });
  };

  // ✅ Assign Winner with Constraints
  const handleAssignWinner = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous error
    const token = localStorage.getItem("authToken");
    if (!token) return alert("❌ Session expired. Please log in again.");

    try {
      await axios.post("http://localhost:8000/api/winners/add", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      });

      fetchWinners();
      setFormData({ tournament: "", athlete: "", position: "1st", prizeAmount: "", awardTitle: "" });
      alert("✅ Winner assigned successfully!");
    } catch (error) {
      const errorMsg = error.response?.data?.msg || "❌ Failed to assign winner.";
      setErrorMessage(errorMsg); // 🔴 Show error in UI
      console.error("🔥 Error assigning winner:", errorMsg);

      // Auto-hide error message after 5 seconds
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  // ✅ Remove Winner (Inside Modal)
  const handleRemoveWinner = async () => {
    if (!selectedWinner) return;
    if (!window.confirm("Are you sure you want to remove this winner?")) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("❌ Session expired. Please log in again.");
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/api/winners/${selectedWinner._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setWinners((prevWinners) => prevWinners.filter(winner => winner._id !== selectedWinner._id));
      setSelectedWinner(null);
      alert("✅ Winner removed successfully.");
    } catch (error) {
      console.error("🔥 Error removing winner:", error.response?.data || error.message);
      alert("❌ Failed to remove winner. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <CouncilNavbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center">🏆 Manage Winners</h1>

        {/* Assign Winner Form */}
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <h2 className="text-2xl font-semibold">Assign Winner</h2>
          <form onSubmit={handleAssignWinner} className="mt-4">
            {/* Select Tournament */}
            <label className="block text-gray-700">Tournament</label>
            <select name="tournament" className="w-full p-2 border rounded mt-1" value={formData.tournament} onChange={handleChange} required>
              <option value="">Select Tournament</option>
              {tournaments.map((tournament) => (
                <option key={tournament._id} value={tournament._id}>{tournament.name}</option>
              ))}
            </select>

            {/* Select Athlete */}
            {/* ✅ Searchable Athlete Dropdown */}
            <label className="block text-gray-700 mt-4">Athlete</label>
            <Select
              options={athletes.map(athlete => ({ value: athlete._id, label: athlete.name }))}
              onChange={handleAthleteSelect}
              placeholder="Search and Select Athlete"
              className="w-full mt-1"
            />

            {/* Select Position */}
            <label className="block text-gray-700 mt-4">Position</label>
            <select name="position" className="w-full p-2 border rounded mt-1" value={formData.position} onChange={handleChange} required>
              <option value="1st">1st Place</option>
              <option value="2nd">2nd Place</option>
              <option value="3rd">3rd Place</option>
            </select>

            {/* Prize Amount */}
            <label className="block text-gray-700 mt-4">Prize Amount ($)</label>
            <input type="number" name="prizeAmount" className="w-full p-2 border rounded mt-1" value={formData.prizeAmount} onChange={handleChange} required />

            {/* Award Title */}
            <label className="block text-gray-700 mt-4">Award Title</label>
            <input type="text" name="awardTitle" className="w-full p-2 border rounded mt-1" value={formData.awardTitle} onChange={handleChange} required />

            <button className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Assign Winner</button>
          </form>
        </div>

        {/* Winners List */}
        <h2 className="text-2xl font-semibold mt-6">Winner List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {winners.map((winner) => (
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

            <div className="mt-4 flex justify-end space-x-3">
              <button className="bg-gray-400 text-white px-4 py-2 rounded-lg" onClick={() => setSelectedWinner(null)}>Close</button>
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition" onClick={handleRemoveWinner}>Remove Winner</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouncilWinners;

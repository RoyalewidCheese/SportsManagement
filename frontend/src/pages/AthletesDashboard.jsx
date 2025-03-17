import AthleteNavbar from "../components/AthleteNavbar";
import { useState, useEffect } from "react";
import axios from "axios";
import ApplyModal from "../components/AthleteModal"; // ✅ Import ApplyModal

const AthletesDashboard = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8000/api/tournaments").then((res) => {
      const today = new Date();
      const upcomingTournaments = res.data.filter((tournament) => new Date(tournament.date) > today);
      setTournaments(upcomingTournaments);
    });
  }, []);

  const handleApplyClick = (tournament) => {
    setSelectedTournament(tournament); // ✅ Set tournament details
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AthleteNavbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">🏅 Upcoming Tournaments</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.length > 0 ? (
            tournaments.map((tournament) => (
              <div key={tournament._id} className="bg-white shadow-md rounded-lg p-4 transition hover:scale-105 hover:shadow-lg">
                <img
                  src={tournament.image || "https://via.placeholder.com/300x200"}
                  alt={tournament.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h2 className="text-xl font-bold text-gray-800">{tournament.name}</h2>
                <p className="text-gray-600 mt-1">{new Date(tournament.date).toLocaleDateString()}</p>
                <p className="text-gray-500 mt-1">📍 {tournament.location}</p>
                <button
                  className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  onClick={() => handleApplyClick(tournament)} // ✅ Open modal
                >
                  Apply Now
                </button>
              </div>
            ))
          ) : (
            <p className="text-center col-span-3 text-gray-500">No tournaments available</p>
          )}
        </div>
      </div>

      {/* ✅ Application Modal */}
      {showModal && (
        <ApplyModal showModal={showModal} setShowModal={setShowModal} tournament={selectedTournament} />
      )}
    </div>
  );
};

export default AthletesDashboard;
import { useState, useEffect } from "react";
import axios from "axios";


const AdminTournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [editTournament, setEditTournament] = useState(null);
  const [updatedData, setUpdatedData] = useState({ name: "", date: "", location: "", image: null });

  useEffect(() => {
    fetchTournaments();
  }, []);

  // ✅ Fetch Tournaments
  const fetchTournaments = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return alert("Unauthorized. Please log in again.");

      const response = await axios.get("http://localhost:8000/api/tournaments", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📥 Tournaments fetched:", response.data);
      setTournaments(response.data);
    } catch (error) {
      console.error("🔥 Error fetching tournaments:", error.response?.data || error.message);
    }
  };

  const handleEditClick = (tournament) => {
    setEditTournament({
      id: tournament._id,
      name: tournament.name,
      date: tournament.date.split("T")[0], // Format date correctly
      location: tournament.location,
      image: tournament.image,
    });
  };
  
  const handleUpdateTournament = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return alert("Unauthorized. Please log in again.");
  
      const updatedTournament = {
        name: editTournament.name,
        date: editTournament.date,
        location: editTournament.location,
        image: editTournament.image, // ✅ Now sending image URL
      };
  
      await axios.put(`http://localhost:8000/api/admin/tournaments/${editTournament.id}`, updatedTournament, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
  
      alert("Tournament updated successfully!");
      setEditTournament(null);
      fetchTournaments(); // Refresh data
    } catch (error) {
      console.error("🔥 Error updating tournament:", error.response?.data || error.message);
    }
  };
  
  
  

  // ✅ Handle Delete Tournament
  const handleDeleteTournament = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return alert("Unauthorized. Please log in again.");

      if (!window.confirm("Are you sure you want to delete this tournament?")) return;

      await axios.delete(`http://localhost:8000/api/tournaments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Tournament deleted successfully!");
      fetchTournaments();
    } catch (error) {
      console.error("🔥 Error deleting tournament:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center">🏆 Tournaments</h2>

        {/* ✅ Tournament Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {tournaments.map((tournament) => (
            <div key={tournament._id} className="bg-white shadow-md p-4 rounded-lg">
              <img
  src={tournament.image.startsWith("http") ? tournament.image : `http://localhost:8000${tournament.image}`}
  alt={tournament.name}
  className="w-full h-44 object-cover rounded-lg shadow-lg"
/>
              <h3 className="text-xl font-semibold mt-2">{tournament.name}</h3>
              <p className="text-gray-600">📅 {new Date(tournament.date).toLocaleDateString()}</p>
              <p className="text-gray-600">📍 {tournament.location}</p>

              {/* Actions */}
              <div className="mt-4 flex justify-between">
                <button
                className="bg-yellow-500 text-white px-3 py-2 rounded"
                onClick={() => handleEditClick(tournament)}
                >
                Edit
                </button>

                <button className="bg-red-500 text-white px-3 py-2 rounded" onClick={() => handleDeleteTournament(tournament._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Edit Modal */}
{editTournament && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-semibold">Edit Tournament</h2>

      <label className="block mt-2">Name</label>
      <input
        type="text"
        className="w-full p-2 border rounded"
        value={editTournament.name}
        onChange={(e) => setEditTournament({ ...editTournament, name: e.target.value })}
      />

      <label className="block mt-2">Date</label>
      <input
        type="date"
        className="w-full p-2 border rounded"
        value={editTournament.date}
        onChange={(e) => setEditTournament({ ...editTournament, date: e.target.value })}
      />

      <label className="block mt-2">Location</label>
      <input
        type="text"
        className="w-full p-2 border rounded"
        value={editTournament.location}
        onChange={(e) => setEditTournament({ ...editTournament, location: e.target.value })}
      />

      {/* ✅ Allow Editing Image via URL */}
      <label className="block mt-2">Tournament Image URL</label>
      <input
        type="text"
        className="w-full p-2 border rounded"
        value={editTournament.image}
        onChange={(e) => setEditTournament({ ...editTournament, image: e.target.value })}
      />

      {/* ✅ Show the Existing Image */}
      <div className="mt-4">
        <p className="text-sm font-semibold text-gray-700">Current Image Preview:</p>
        <img src={editTournament.image} alt="Tournament" className="w-full h-40 object-cover rounded" />
      </div>

      <div className="mt-6 flex justify-between">
        <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setEditTournament(null)}>
          Cancel
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleUpdateTournament}>
          Save
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default AdminTournaments;

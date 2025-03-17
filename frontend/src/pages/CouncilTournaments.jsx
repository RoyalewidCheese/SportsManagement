import CouncilNavbar from "../components/CouncilNavbar";
import { useState, useEffect } from "react";
import axios from "axios";

const CouncilTournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTournament, setEditingTournament] = useState(null);
  const [formData, setFormData] = useState({ name: "", date: "", location: "", image: "" });

  const refreshToken = async () => {
    const token = getToken();
    if (!token) return;
  
    try {
      const res = await axios.post("http://localhost:8000/api/auth/refresh", { token });
      localStorage.setItem("authToken", res.data.token);
    } catch (error) {
      console.error("Error refreshing token:", error.response?.data || error.message);
    }
  };
  
  // Refresh token every 55 minutes (before it expires)
  useEffect(() => {
    const interval = setInterval(refreshToken, 55 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  const getToken = () => {
    const token = localStorage.getItem("authToken");
  
    if (!token) {
      console.warn("No auth token found. User may need to log in again.");
      return null;
    }
  
    return token; // Ensures a valid token is returned
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    let token = getToken();
    if (!token) return;
  
    try {
      const res = await axios.get("http://localhost:8000/api/tournaments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTournaments(res.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.error("Session expired. Attempting token refresh...");
        await refreshToken(); // Try refreshing token
    
        token = getToken(); // Get new token
        if (token) {
          fetchTournaments(); // Retry with refreshed token
        } else {
          console.error("Unauthorized. Redirecting to login.");
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        }
      } else {
        console.error("🔥 Error fetching tournaments:", error.response?.data || error.message);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tournament?")) return;

    const token = getToken();
    if (!token) return;

    console.log(`🗑 Attempting to delete tournament ID: ${id}`);

    try {
        // Convert ID to a string before sending
        const tournamentId = String(id);

        await axios.delete(`http://localhost:8000/api/tournaments/${tournamentId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log(`✅ Tournament ${tournamentId} deleted successfully.`);
        fetchTournaments();
    } catch (error) {
        if (error.response?.status === 404) {
            console.error(`❌ Tournament ID ${id} not found.`);
        } else {
            console.error("🔥 Error deleting tournament:", error.response?.data || error.message);
        }
    }
};

  const handleShowModal = (tournament = null) => {
    setEditingTournament(tournament);
    setFormData(tournament ? 
      { name: tournament.name, date: tournament.date, location: tournament.location, image: tournament.image || "" } 
      : { name: "", date: "", location: "", image: "" });
    setShowModal(true);
  };

  const handleSave = async () => {
    const token = getToken();
    if (!token) return;

    try {
        const url = editingTournament 
            ? `http://localhost:8000/api/tournaments/${editingTournament._id}`
            : "http://localhost:8000/api/tournaments";

        const method = editingTournament ? "put" : "post";

        console.log("📤 Sending request:", method.toUpperCase(), url, formData);

        const response = await axios[method](url, formData, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Tournament saved:", response.data);
        fetchTournaments();
        setShowModal(false);
    } catch (error) {
        console.error("🔥 Error saving tournament:", error.response?.data || error.message);
    }
};


  return (
    <div className="min-h-screen bg-gray-100">
      <CouncilNavbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center">🏆 Manage Tournaments</h1>
        <button
          onClick={() => handleShowModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition mt-4"
        >
          + Add Tournament
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {tournaments.map((tournament) => (
            <div key={tournament._id} className="bg-white shadow-md rounded-lg p-4">
              {tournament.image && <img src={tournament.image} alt={tournament.name} className="w-full h-40 object-cover rounded" />}
              <h2 className="text-xl font-bold">{tournament.name}</h2>
              <p className="text-gray-600">{new Date(tournament.date).toLocaleDateString()}</p>
              <p className="text-gray-500">📍 {tournament.location}</p>
              <button
                className="mt-2 w-full bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                onClick={() => handleShowModal(tournament)}
              >
                Edit
              </button>
              <button
                className="mt-2 w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                onClick={() => handleDelete(tournament._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold text-gray-800">{editingTournament ? "Edit Tournament" : "Add Tournament"}</h2>
            <label className="block mt-4 text-gray-700">Name</label>
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border rounded mt-1"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <label className="block mt-4 text-gray-700">Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded mt-1"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            <label className="block mt-4 text-gray-700">Location</label>
            <input
              type="text"
              placeholder="Location"
              className="w-full p-2 border rounded mt-1"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <label className="block mt-4 text-gray-700">Image</label>
            <input
              type="text"
              placeholder="Image URL"
              className="w-full p-2 border rounded mt-1"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
            <div className="mt-6 flex justify-end space-x-2">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                onClick={handleSave}
              >
                {editingTournament ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouncilTournaments;
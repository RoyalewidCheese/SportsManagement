import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";

const AdminCouncil = () => {
  const [councils, setCouncils] = useState([]);
  const [filteredCouncils, setFilteredCouncils] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editCouncil, setEditCouncil] = useState(null);
  const [updatedData, setUpdatedData] = useState({ name: "", email: "" });

  useEffect(() => {
    fetchCouncils();
  }, []);

  // ✅ Fetch Sports Councils
  const fetchCouncils = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return alert("Unauthorized. Please log in again.");

      const response = await axios.get("http://localhost:8000/api/council/admin/sports-councils", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📥 Councils fetched:", response.data);
      setCouncils(response.data);
      setFilteredCouncils(response.data);
    } catch (error) {
      console.error("🔥 Error fetching councils:", error.response?.data || error.message);
    }
  };

  // ✅ Handle Search Function
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!query) {
      setFilteredCouncils(councils);
    } else {
      const filtered = councils.filter(
        (council) => council.name.toLowerCase().includes(query) || council.email.toLowerCase().includes(query)
      );
      setFilteredCouncils(filtered);
    }
  };

  // ✅ Open Edit Modal with Prefilled Data
  const openEditModal = (council) => {
    setEditCouncil(council);
    setUpdatedData({ name: council.name, email: council.email });
  };

  // ✅ Handle Edit Function
  const handleEditCouncil = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return alert("Unauthorized. Please log in again.");

      await axios.put(`http://localhost:8000/api/council/admin/sports-councils/${editCouncil._id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Sports Council updated successfully!");
      fetchCouncils();
      setEditCouncil(null);
    } catch (error) {
      console.error("🔥 Error updating council:", error.response?.data || error.message);
    }
  };

  // ✅ Handle Delete Function
  const handleDeleteCouncil = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return alert("Unauthorized. Please log in again.");

      if (!window.confirm("Are you sure you want to delete this Sports Council?")) return;

      await axios.delete(`http://localhost:8000/api/council/admin/sports-councils/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Sports Council deleted successfully!");
      fetchCouncils();
    } catch (error) {
      console.error("🔥 Error deleting council:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg">
        <h2 className="text-3xl font-bold text-gray-800 text-center">🏆 Sports Councils</h2>

        {/* ✅ Search Bar */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search by Name or Email..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ✅ Table for Sports Councils */}
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-3 text-left">Profile</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCouncils.map((council) => (
                <tr key={council._id} className="border-t border-gray-300">
                  <td className="p-3">
                    <img
                      src={council.image}
                      alt={council.name}
                      className="w-16 h-16 object-cover rounded-full border-2 border-green-600"
                      onError={(e) => (e.target.src = "/default-profile.png")}
                    />
                  </td>
                  <td className="p-3">{council.name}</td>
                  <td className="p-3">{council.email}</td>
                  <td className="p-3">
                    <button className="bg-yellow-500 text-white px-3 py-2 rounded mr-2" onClick={() => openEditModal(council)}>
                      Edit
                    </button>
                    <button className="bg-red-500 text-white px-3 py-2 rounded" onClick={() => handleDeleteCouncil(council._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Edit Modal (Prefilled & Labeled) */}
      {editCouncil && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">✏️ Edit Sports Council</h2>
            
            <label className="block font-medium text-gray-700">Name:</label>
            <input
              type="text"
              className="w-full p-2 border rounded mt-1"
              value={updatedData.name}
              onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
            />

            <label className="block font-medium text-gray-700 mt-3">Email:</label>
            <input
              type="text"
              className="w-full p-2 border rounded mt-1"
              value={updatedData.email}
              onChange={(e) => setUpdatedData({ ...updatedData, email: e.target.value })}
            />

            <div className="mt-6 flex justify-between">
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setEditCouncil(null)}>
                Cancel
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleEditCouncil}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCouncil;

import { useState, useEffect } from "react";
import axios from "axios";

const AdminAthletes = () => {
  const [athletes, setAthletes] = useState([]);
  const [filteredAthletes, setFilteredAthletes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editAthlete, setEditAthlete] = useState(null);
  const [updatedData, setUpdatedData] = useState({ name: "", email: "", admissionNumber: "" });

  useEffect(() => {
    fetchAthletes();
  }, []);

  // ✅ Fetch Athletes
  const fetchAthletes = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return alert("Unauthorized. Please log in again.");

      const response = await axios.get("http://localhost:8000/api/athletes/admin/athletes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📥 Athletes fetched:", response.data);
      setAthletes(response.data);
      setFilteredAthletes(response.data);
    } catch (error) {
      console.error("🔥 Error fetching athletes:", error.response?.data || error.message);
    }
  };

  // ✅ Handle Search Function
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  
    if (!query) {
      setFilteredAthletes(athletes); // ✅ Reset when search is empty
    } else {
      const filtered = athletes.filter((athlete) => {
        const name = athlete.name?.toLowerCase() || "";  // ✅ Prevent undefined
        const email = athlete.email?.toLowerCase() || "";
        const admissionNumber = athlete.admissionNumber?.toLowerCase() || "";
        const institutionName = athlete.instituteId?.name?.toLowerCase() || ""; // ✅ Check if `instituteId` exists
  
        return (
          name.includes(query) ||
          email.includes(query) ||
          admissionNumber.includes(query) ||
          institutionName.includes(query)
        );
      });
  
      setFilteredAthletes(filtered);
    }
  };
  
  

  // ✅ Handle Edit Function
  const handleEditAthlete = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return alert("Unauthorized. Please log in again.");

      await axios.put(`http://localhost:8000/api/athletes/admin/athletes/${editAthlete._id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Athlete updated successfully!");
      fetchAthletes();
      setEditAthlete(null);
    } catch (error) {
      console.error("🔥 Error updating athlete:", error.response?.data || error.message);
    }
  };

  // ✅ Handle Delete Function
  const handleDeleteAthlete = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return alert("Unauthorized. Please log in again.");
  
      if (!window.confirm("Are you sure you want to delete this athlete?")) return;
  
      await axios.delete(`http://localhost:8000/api/athletes/admin/athletes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      alert("Athlete deleted successfully!");
      fetchAthletes(); // ✅ Refresh list after deletion
    } catch (error) {
      console.error("🔥 Error deleting athlete:", error.response?.data || error.message);
    }
  };
  

  return (
    <div>
      <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg">
        <h2 className="text-3xl font-bold text-gray-800 text-center">🏆 Registered Athletes</h2>

        {/* ✅ Search Bar */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search by Name, Email, Admission No. or Institution..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ✅ Table for Athletes */}
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-3 text-left">Profile</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Admission No.</th>
                <th className="p-3 text-left">Institution</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAthletes.map((athlete) => (
                <tr key={athlete._id} className="border-t border-gray-300">
                  <td className="p-3">
                  <img
                    src={athlete.image} // ✅ Uses corrected backend URL
                    alt={athlete.name}
                    className="w-16 h-16 object-cover rounded-full border-2 border-green-600"
                    onError={(e) => (e.target.src = "/default-profile.png")} // ✅ Fallback for missing images
                  />
                  </td>
                  <td className="p-3">{athlete.name}</td>
                  <td className="p-3">{athlete.email}</td>
                  <td className="p-3">{athlete.admissionNumber}</td>
                  <td className="p-3">{athlete.instituteId?.name || "N/A"}</td>
                  <td className="p-3">
                    <button className="bg-red-500 text-white px-3 py-2 rounded" onClick={() => handleDeleteAthlete(athlete._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Edit Modal */}
      {editAthlete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold">Edit Athlete</h2>
            <label className="block text-gray-600 mt-2">Name:</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={updatedData.name}
              onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
            />
            <label className="block text-gray-600 mt-2">Email:</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={updatedData.email}
              onChange={(e) => setUpdatedData({ ...updatedData, email: e.target.value })}
            />
            <label className="block text-gray-600 mt-2">Admission No.:</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={updatedData.admissionNumber}
              onChange={(e) => setUpdatedData({ ...updatedData, admissionNumber: e.target.value })}
            />
            <div className="mt-6 flex justify-between">
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setEditAthlete(null)}>
                Cancel
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleEditAthlete}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAthletes;

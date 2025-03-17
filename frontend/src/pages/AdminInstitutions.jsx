import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";

const AdminInstitutions = () => {
  const [institutions, setInstitutions] = useState([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState([]); // ✅ Store filtered results
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchInstitutions();
  }, []);

  // ✅ Fetch All Institutions
  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://localhost:8000/api/admin/institutions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📥 Institutions fetched:", response.data);
      setInstitutions(response.data);
      setFilteredInstitutions(response.data); // ✅ Initialize filtered list
    } catch (error) {
      console.error("🔥 Error fetching institutions:", error);
      setError(error.response?.data?.msg || "Failed to fetch institutions.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Search Institutions Dynamically
  useEffect(() => {
    if (!searchQuery) {
      setFilteredInstitutions(institutions);
      return;
    }
    const filtered = institutions.filter((inst) =>
      inst.name.toLowerCase().startsWith(searchQuery.toLowerCase()) || 
      inst.location.toLowerCase().startsWith(searchQuery.toLowerCase()) // ✅ Strict consecutive letter match
    );
    setFilteredInstitutions(filtered);
  }, [searchQuery, institutions]);

  return (
    <div>
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 text-center">🏫 Manage Institutions</h2>

        {/* Display Error */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Search Bar */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Search by Name or Location..."
          className="mt-4 w-full p-2 border rounded"
        />

        {/* Institutions List */}
        {loading ? (
          <p className="text-center mt-6">Loading institutions...</p>
        ) : (
          <table className="mt-6 w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3 text-left">Name</th>
                <th className="border p-3 text-left">Location</th>
                <th className="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInstitutions.length > 0 ? (
                filteredInstitutions.map((institution) => (
                  <tr key={institution._id} className="border">
                    <td className="p-3">{institution.name}</td>
                    <td className="p-3">{institution.location}</td>
                    <td className="p-3 flex gap-2 justify-center">
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        onClick={() => setEditData(institution)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={async () => {
                          if (!window.confirm("Are you sure you want to delete this institution?")) return;
                          try {
                            const token = localStorage.getItem("authToken");
                            await axios.delete(`http://localhost:8000/api/admin/institutions/${institution._id}`, {
                              headers: { Authorization: `Bearer ${token}` },
                            });
                            fetchInstitutions(); // Refresh list after delete
                          } catch (error) {
                            console.error("🔥 Error deleting institution:", error);
                            setError(error.response?.data?.msg || "Failed to delete institution.");
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center p-4">No institutions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Institution Modal */}
      {editData && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold text-gray-800">Edit Institution</h2>
            <input
              type="text"
              className="w-full p-2 border rounded mt-2"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />
            <input
              type="text"
              className="w-full p-2 border rounded mt-2"
              value={editData.location}
              onChange={(e) => setEditData({ ...editData, location: e.target.value })}
            />

            <div className="mt-6 flex justify-between">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                onClick={() => setEditData(null)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("authToken");
                    await axios.put(
                      `http://localhost:8000/api/admin/institutions/${editData._id}`,
                      editData,
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setEditData(null);
                    fetchInstitutions(); // Refresh list after edit
                  } catch (error) {
                    console.error("🔥 Error updating institution:", error);
                    setError(error.response?.data?.msg || "Failed to update institution.");
                  }
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInstitutions;

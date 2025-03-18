import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash2, Search } from "lucide-react";

const AdminCouncil = () => {
  const [councils, setCouncils] = useState([]);
  const [filteredCouncils, setFilteredCouncils] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editCouncil, setEditCouncil] = useState(null);
  const [updatedData, setUpdatedData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCouncils();
  }, []);

  const fetchCouncils = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) return alert("Unauthorized. Please log in again.");

      const response = await axios.get("http://localhost:8000/api/council/admin/sports-councils", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCouncils(response.data);
      setFilteredCouncils(response.data);
    } catch (error) {
      console.error("Error fetching councils:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

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

  const openEditModal = (council) => {
    setEditCouncil(council);
    setUpdatedData({ name: council.name, email: council.email });
  };

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
      console.error("Error updating council:", error.response?.data || error.message);
    }
  };

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
      console.error("Error deleting council:", error.response?.data || error.message);
    }
  };

  return (
    <div className="w-full">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-600">Total Councils</h3>
          <p className="text-3xl font-bold mt-2">{councils.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-600">Active Councils</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">{councils.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-600">Last Updated</h3>
          <p className="text-lg font-medium mt-2">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <span className="mr-2">🏆</span>
              Sports Councils
            </h2>
            <div className="mt-4 md:mt-0 relative flex items-center w-full md:w-64">
              <Search size={18} className="absolute left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search councils..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Council List */}
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCouncils.length > 0 ? (
                  filteredCouncils.map((council) => (
                    <tr key={council._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            src={council.image || "/default-profile.png"}
                            alt={council.name}
                            className="h-12 w-12 rounded-full object-cover border-2 border-blue-500"
                            onError={(e) => (e.target.src = "/default-profile.png")}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{council.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{council.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openEditModal(council)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 p-2 rounded-md inline-flex items-center mr-2"
                        >
                          <Edit size={16} />
                          <span className="ml-1">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteCouncil(council._id)}
                          className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 p-2 rounded-md inline-flex items-center"
                        >
                          <Trash2 size={16} />
                          <span className="ml-1">Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      No councils found. Try a different search term.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editCouncil && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Edit Sports Council</h3>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={updatedData.name}
                  onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={updatedData.email}
                  onChange={(e) => setUpdatedData({ ...updatedData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 mr-3"
                onClick={() => setEditCouncil(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                onClick={handleEditCouncil}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCouncil;
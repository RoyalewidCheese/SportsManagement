import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash2, Search, PlusCircle } from "lucide-react";

const AdminInstitutions = () => {
  const [institutions, setInstitutions] = useState([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editData, setEditData] = useState(null);
  const [newInstitution, setNewInstitution] = useState(null);
  const [newData, setNewData] = useState({ name: "", location: "" });

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://localhost:8000/api/admin/institutions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setInstitutions(response.data);
      setFilteredInstitutions(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching institutions:", error);
      setError(error.response?.data?.msg || "Failed to fetch institutions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchQuery) {
      setFilteredInstitutions(institutions);
      return;
    }
    const filtered = institutions.filter((inst) =>
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      inst.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredInstitutions(filtered);
  }, [searchQuery, institutions]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this institution?")) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:8000/api/admin/institutions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchInstitutions();
    } catch (error) {
      console.error("Error deleting institution:", error);
      setError(error.response?.data?.msg || "Failed to delete institution.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `http://localhost:8000/api/admin/institutions/${editData._id}`,
        editData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditData(null);
      fetchInstitutions();
    } catch (error) {
      console.error("Error updating institution:", error);
      setError(error.response?.data?.msg || "Failed to update institution.");
    }
  };

  return (
    <div className="w-full">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-600">Total Institutions</h3>
          <p className="text-3xl font-bold mt-2">{institutions.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-600">Locations</h3>
          <p className="text-3xl font-bold mt-2 text-blue-600">
            {new Set(institutions.map(i => i.location)).size}
          </p>
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
              <span className="mr-2">🏫</span>
              Institutions Management
            </h2>
            <div className="mt-4 md:mt-0 flex items-center">
              <div className="relative mr-3">
                <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search institutions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 m-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Institutions List */}
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
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInstitutions.length > 0 ? (
                  filteredInstitutions.map((institution) => (
                    <tr key={institution._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{institution.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{institution.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setEditData(institution)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 p-2 rounded-md inline-flex items-center mr-2"
                        >
                          <Edit size={16} />
                          <span className="ml-1">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(institution._id)}
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
                    <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                      No institutions found. Try a different search term or add a new institution.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editData && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Edit Institution</h3>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editData.location}
                  onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 mr-3"
                onClick={() => setEditData(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                onClick={handleUpdate}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Modal */}
      {newInstitution && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          
        </div>
      )}
    </div>
  );
};

export default AdminInstitutions;
import { useState, useEffect } from "react";
import axios from "axios";
import { Search, AlertCircle, Edit, Trash2, Filter, DollarSign } from "lucide-react";

const AdminSponsors = () => {
  const [sponsors, setSponsors] = useState([]);
  const [filteredSponsors, setFilteredSponsors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editSponsor, setEditSponsor] = useState(null);
  const [updatedData, setUpdatedData] = useState({ name: "", email: "", company: "", phone: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [companyFilter, setCompanyFilter] = useState("all");
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetchSponsors();
  }, []);

  // Extract unique companies from sponsors data
  useEffect(() => {
    if (sponsors.length > 0) {
      const uniqueCompanies = [...new Set(sponsors
        .filter(sponsor => sponsor.company)
        .map(sponsor => sponsor.company))];
      setCompanies(uniqueCompanies);
    }
  }, [sponsors]);

  // Fetch Sponsors
  const fetchSponsors = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Unauthorized. Please log in again.");
        return;
      }

      const response = await axios.get("http://localhost:8000/api/sponsors/admin/sponsors", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSponsors(response.data);
      setFilteredSponsors(response.data);
      setError(null);
    } catch (error) {
      setError("Failed to load sponsors. Please try again.");
      console.error("Error fetching sponsors:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search and filter
  useEffect(() => {
    let result = [...sponsors];
    
    // Apply company filter
    if (companyFilter !== "all") {
      result = result.filter(sponsor => 
        sponsor.company === companyFilter
      );
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((sponsor) => {
        const name = sponsor.name?.toLowerCase() || "";
        const email = sponsor.email?.toLowerCase() || "";
        const company = sponsor.company?.toLowerCase() || "";
        const phone = sponsor.phone?.toLowerCase() || "";
  
        return (
          name.includes(query) ||
          email.includes(query) ||
          company.includes(query) ||
          phone.includes(query)
        );
      });
    }
    
    setFilteredSponsors(result);
  }, [searchQuery, sponsors, companyFilter]);

  // Handle Delete Function
  const handleDeleteSponsor = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return setError("Unauthorized. Please log in again.");
  
      if (!window.confirm("Are you sure you want to delete this sponsor?")) return;
  
      await axios.delete(`http://localhost:8000/api/sponsors/admin/sponsors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      fetchSponsors();
    } catch (error) {
      setError("Failed to delete sponsor. Please try again.");
      console.error("Error deleting sponsor:", error.response?.data || error.message);
    }
  };

  return (
    <div className="p-4">
      {/* Error display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
          <div className="flex items-center">
            <AlertCircle size={20} className="text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Search and filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, company, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter size={18} className="mr-2" />
            <span>Filter</span>
          </button>
          
          {filterOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
              <div className="p-4">
                <h3 className="font-medium mb-2">Company</h3>
                <select
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="all">All Companies</option>
                  {companies.map((company, index) => (
                    <option key={index} value={company}>{company}</option>
                  ))}
                </select>
              </div>
              <div className="border-t border-gray-200 p-2 text-right">
                <button 
                  onClick={() => {
                    setCompanyFilter("all");
                    setFilterOpen(false);
                  }}
                  className="px-4 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Reset
                </button>
                <button 
                  onClick={() => setFilterOpen(false)}
                  className="px-4 py-1 text-sm bg-blue-500 text-white rounded ml-2"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Sponsor stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <h3 className="text-lg font-medium text-yellow-700">Total Sponsors</h3>
              <p className="text-3xl font-bold text-yellow-800">{sponsors.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h3 className="text-lg font-medium text-green-700">Active Companies</h3>
              <p className="text-3xl font-bold text-green-800">{companies.length}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h3 className="text-lg font-medium text-purple-700">Filtered Sponsors</h3>
              <p className="text-3xl font-bold text-purple-800">{filteredSponsors.length}</p>
            </div>
          </div>

          {/* Sponsors Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sponsor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSponsors.length > 0 ? (
                    filteredSponsors.map((sponsor) => (
                      <tr key={sponsor._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img 
                                className="h-10 w-10 rounded-full object-cover border border-gray-200" 
                                src={sponsor.image ? `http://localhost:8000${sponsor.image}` : "/default-profile.png"}
                                alt={sponsor.name}
                                onError={(e) => (e.target.src = "/default-profile.png")}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{sponsor.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sponsor.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            className="text-red-600 hover:text-red-900 ml-4"
                            onClick={() => handleDeleteSponsor(sponsor._id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No sponsors found matching your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminSponsors;
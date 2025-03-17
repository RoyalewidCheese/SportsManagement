import { useState, useEffect } from "react";
import axios from "axios";

const AdminSponsors = () => {
  const [sponsors, setSponsors] = useState([]);
  const [filteredSponsors, setFilteredSponsors] = useState([]); // ✅ For Search
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Search Query

  useEffect(() => {
    fetchSponsors();
  }, []);

  // ✅ Fetch All Sponsors (From Users with role "Sponsor")
  const fetchSponsors = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return alert("Unauthorized. Please log in again.");

      const response = await axios.get("http://localhost:8000/api/sponsors/admin/sponsors", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📥 Sponsors fetched:", response.data);
      setSponsors(response.data);
      setFilteredSponsors(response.data); // ✅ Set initial data
    } catch (error) {
      console.error("🔥 Error fetching sponsors:", error.response?.data || error.message);
    }
  };

  // ✅ Handle Search Function (Prevents Undefined Errors)
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!query) {
      setFilteredSponsors(sponsors); // ✅ Reset search when empty
    } else {
      const filtered = sponsors.filter((sponsor) => {
        const name = sponsor.name?.toLowerCase() || ""; // ✅ Avoid undefined
        const email = sponsor.email?.toLowerCase() || "";
        const company = sponsor.company?.toLowerCase() || "";
        const phone = sponsor.phone?.toLowerCase() || "";

        return name.includes(query) || email.includes(query) || company.includes(query) || phone.includes(query);
      });

      setFilteredSponsors(filtered);
    }
  };

  // ✅ Handle Delete Function
  const handleDeleteSponsor = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return alert("Unauthorized. Please log in again.");

      if (!window.confirm("Are you sure you want to delete this sponsor?")) return;

      await axios.delete(`http://localhost:8000/api/sponsors/admin/sponsors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Sponsor deleted successfully!");
      fetchSponsors(); // ✅ Refresh list
    } catch (error) {
      console.error("🔥 Error deleting sponsor:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg">
        <h2 className="text-3xl font-bold text-gray-800 text-center">💰 Sponsors Management</h2>

        {/* ✅ Search Bar */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search by Name, Email, Company, or Phone..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ✅ Sponsors Table */}
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-3 text-left">Profile</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Company</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSponsors.map((sponsor) => (
                <tr key={sponsor._id} className="border-t border-gray-300">
                  <td className="p-3">
                    <img
                      src={sponsor.image ? `http://localhost:8000${sponsor.image}` : "/default-profile.png"}
                      alt={sponsor.name}
                      className="w-16 h-16 object-cover rounded-full border-2 border-green-600"
                    />
                  </td>
                  <td className="p-3">{sponsor.name}</td>
                  <td className="p-3">{sponsor.email}</td>
                  <td className="p-3">{sponsor.company}</td>
                  <td className="p-3">{sponsor.phone}</td>
                  <td className="p-3">
                    <button
                      className="bg-red-500 text-white px-3 py-2 rounded"
                      onClick={() => handleDeleteSponsor(sponsor._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ Empty List Message */}
        {filteredSponsors.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No sponsors found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminSponsors;

import { useState, useEffect } from "react";
import axios from "axios";
import InstitutionNavbar from "../components/InstitutionNavbar";

const ViewAthletes = () => {
  const [athletes, setAthletes] = useState([]);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const athletesPerPage = 6;
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchAthletes();
  }, []);

  // ✅ Fetch athletes from institution
  const fetchAthletes = async () => {
    try {
      console.log("📡 Fetching athletes...");
  
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("❌ Unauthorized. Please log in again.");
        return;
      }
  
      const institutionId = localStorage.getItem("instituteId");
      if (!institutionId) {
        alert("❌ Institution ID not found. Please re-login.");
        return;
      }
  
      console.log(`🔹 Fetching athletes for institution: ${institutionId}`);
  
      const response = await axios.get(`http://localhost:8000/api/institutions/${institutionId}/athletes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("✅ Athletes Retrieved:", response.data);
      setAthletes(response.data);
    } catch (error) {
      console.error("🔥 Error fetching athletes:", error.response?.data || error.message);
    }
  };  

  // ✅ Select an athlete for details
  const handleAthleteClick = (athlete) => {
    console.log("👀 Selected Athlete:", athlete);
    setSelectedAthlete(athlete);
  };

  // ✅ Edit Athlete
  const handleEditAthlete = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return alert("Unauthorized. Please log in again.");
  
      if (!editData || !editData._id) {
        console.error("❌ No athlete selected for editing.");
        return;
      }
  
      console.log(`🔄 Updating athlete ID: ${editData._id}`);
  
      const response = await axios.put(
        `http://localhost:8000/api/institutions/athletes/${editData._id}`, 
        editData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("✅ Athlete updated:", response.data);
  
      setEditData(null);
      fetchAthletes(); // Refresh data
    } catch (error) {
      console.error("🔥 Error updating athlete:", error.response?.data || error.message);
    }
  };
  

  // ✅ Delete Athlete
  const handleDeleteAthlete = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Unauthorized. Please log in again.");
        return;
      }

      if (!window.confirm("Are you sure you want to delete this athlete?")) return;

      console.log(`🗑 Deleting athlete: ${id}`);
      await axios.delete(`http://localhost:8000/api/institutions/athletes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Athlete deleted successfully!");
      setAthletes((prevAthletes) => prevAthletes.filter((athlete) => athlete._id !== id));
      setSelectedAthlete(null);
    } catch (error) {
      console.error("🔥 Error deleting athlete:", error.response?.data || error.message);
    }
  };

  // ✅ Pagination logic
  const indexOfLastAthlete = currentPage * athletesPerPage;
  const indexOfFirstAthlete = indexOfLastAthlete - athletesPerPage;
  const currentAthletes = athletes.slice(indexOfFirstAthlete, indexOfLastAthlete);

  return (
    <div>
      <InstitutionNavbar />
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg">
        <h2 className="text-3xl font-bold text-gray-800 text-center">🏆 Registered Athletes</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {currentAthletes.map((athlete) => (
            <div
              key={athlete._id}
              className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center cursor-pointer hover:bg-gray-200 transition"
              onClick={() => handleAthleteClick(athlete)}
            >
              <img
                src={athlete.image ? `http://localhost:8000${athlete.image}` : "/default-profile.png"}
                alt={athlete.name}
                className="w-24 h-24 object-cover rounded-full mb-3 border-2 border-gray-300"
              />
              <h3 className="text-xl font-semibold">{athlete.name}</h3>
              <p className="text-gray-600">🎓 {athlete.admissionNumber}</p>
            </div>
          ))}
        </div>

        {/* ✅ Pagination */}
        <div className="mt-6 flex justify-center space-x-2">
          {Array.from({ length: Math.ceil(athletes.length / athletesPerPage) }, (_, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ Athlete Detail Modal */}
      {selectedAthlete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold text-gray-800">Athlete Details</h2>
            <img
              src={selectedAthlete.image ? `http://localhost:8000${selectedAthlete.image}` : "/default-profile.png"}
              alt={selectedAthlete.name}
              className="w-32 h-32 object-cover rounded-full mx-auto my-4"
            />
            <p className="text-lg"><strong>Name:</strong> {selectedAthlete.name}</p>
            <p className="text-lg"><strong>Email:</strong> {selectedAthlete.email}</p>
            <p className="text-lg"><strong>Admission Number:</strong> {selectedAthlete.admissionNumber}</p>

            <div className="mt-6 flex justify-between">
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setSelectedAthlete(null)}>Close</button>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={() => setEditData(selectedAthlete)}>Edit</button>
              <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleDeleteAthlete(selectedAthlete._id)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Edit Athlete Modal */}
      {editData && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold text-gray-800">Edit Athlete</h2>
            <input type="text" className="w-full p-2 border rounded mt-2" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
            <input type="text" className="w-full p-2 border rounded mt-2" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
            <input type="text" className="w-full p-2 border rounded mt-2" value={editData.admissionNumber} onChange={(e) => setEditData({ ...editData, admissionNumber: e.target.value })} />

            <div className="mt-6 flex justify-between">
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setEditData(null)}>Cancel</button>
              <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleEditAthlete}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAthletes;

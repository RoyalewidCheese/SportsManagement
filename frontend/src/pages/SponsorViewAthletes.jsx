import { useState, useEffect } from "react";
import axios from "axios";
import SponsorNavbar from "../components/SponsorNavbar";

const SponsorViewAthletes = () => {
  const [institutions, setInstitutions] = useState([]);
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [athletes, setAthletes] = useState([]);
  const [selectedAthlete, setSelectedAthlete] = useState(null);

  useEffect(() => {
    fetchInstitutions();
  }, []);

  // ✅ Fetch Institutions (Schools/Colleges)
  const fetchInstitutions = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/institutions");
      setInstitutions(response.data);
    } catch (error) {
      console.error("🔥 Error fetching institutions:", error.response?.data || error.message);
    }
  };

  // ✅ Fetch Athletes by Institution
  const fetchAthletes = async (institutionId) => {
    if (!institutionId) return;

    try {
      const res = await axios.get(`http://localhost:8000/api/institutions/${institutionId}/athletes`);
      setAthletes(res.data);
    } catch (error) {
      console.error("🔥 Error fetching athletes:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <SponsorNavbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center">🏅 View Athletes</h1>

        {/* Institution Selection Dropdown */}
        <div className="mt-6">
          <label className="block text-gray-700 font-semibold">Select Institution</label>
          <select
            className="w-full p-2 border rounded mt-1"
            value={selectedInstitution}
            onChange={(e) => {
              setSelectedInstitution(e.target.value);
              fetchAthletes(e.target.value);
            }}
          >
            <option value="">Choose Institution</option>
            {institutions.map((inst) => (
              <option key={inst._id} value={inst._id}>
                {inst.name}
              </option>
            ))}
          </select>
        </div>

        {/* Athlete Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {athletes.map((athlete) => (
            <div key={athlete._id} className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
              <img
                src={`http://localhost:8000${athlete.image}`}
                alt={athlete.name}
                className="w-24 h-24 object-cover rounded-full mb-3 border-2 border-green-600"
                onError={(e) => (e.target.src = "/default-profile.png")} // ✅ Fallback for missing images
              />
              <h3 className="text-xl font-bold">{athlete.name}</h3>
              <p className="text-gray-600">🎓 Admission No: {athlete.admissionNumber}</p>
              <button
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                onClick={() => setSelectedAthlete(athlete)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Athlete Details Modal */}
      {selectedAthlete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold">{selectedAthlete.name}</h2>
            <p className="text-gray-600">🏅 Institution: {selectedAthlete.instituteId?.name || "N/A"}</p> {/* ✅ Fixed field */}
            <p className="text-gray-600">🎓 Admission No: {selectedAthlete.admissionNumber}</p>
            <p className="text-gray-600">📅 Joined: {new Date(selectedAthlete.createdAt).toDateString()}</p>

            {/* Achievements Section */}
            <h3 className="text-xl font-semibold mt-4">🏆 Achievements</h3>
            {selectedAthlete.achievements?.length > 0 ? (
              <ul className="list-disc list-inside">
                {selectedAthlete.achievements.map((ach) => (
                  <li key={ach._id}>
                    {ach.tournament.name} - {ach.position} Place 🏅
                    <br />
                    🎖 {ach.awardTitle} | 💰 ${ach.prizeAmount}
                    <br />
                    📅 {new Date(ach.createdAt).toDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No achievements recorded.</p>
            )}

            <button
              className="mt-4 bg-gray-400 text-white px-4 py-2 rounded-lg"
              onClick={() => setSelectedAthlete(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SponsorViewAthletes;

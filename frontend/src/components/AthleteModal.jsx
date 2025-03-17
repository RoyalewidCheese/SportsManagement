import { useState, useEffect } from "react";
import axios from "axios";

const ApplyModal = ({ showModal, setShowModal, tournament }) => {
  const [formData, setFormData] = useState({
    athleteName: "",
    email: "",
    tournamentName: tournament?.name || "",
    status: "Pending",
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return console.error("No auth token found");

      const res = await axios.get("http://localhost:8000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      setFormData((prevData) => ({
        ...prevData,
        athleteName: res.data.name,
        email: res.data.email,
        tournamentName: tournament?.name || "",
      }));
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleApply = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return console.error("No auth token found");
      if (!user) return console.error("User data not loaded yet");

      const applicationData = {
        athlete: user._id, // athlete ID from logged in user
        tournament: tournament?._id, // tournament ID from selected tournament
        tournamentName: tournament?.name || "",
        location: tournament?.location || "Unknown",
        status: "Pending",
      };

      console.log("📤 Submitting Application:", applicationData);

      await axios.post("http://localhost:8000/api/applications", applicationData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowModal(false);
      alert(`Application submitted for ${tournament.name}`);
    } catch (error) {
      console.error("🔥 Error submitting application:", error.response?.data || error.message);
      alert("Failed to apply. Try again.");
    }
  };

  return (
    showModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-semibold text-gray-800">Apply for Tournament</h2>
          <label className="block mt-4 text-gray-700">Athlete Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded mt-1"
            value={formData.athleteName}
            disabled
          />

          <label className="block mt-4 text-gray-700">Email</label>
          <input
            type="text"
            className="w-full p-2 border rounded mt-1"
            value={formData.email}
            disabled
          />

          <label className="block mt-4 text-gray-700">Tournament</label>
          <input
            type="text"
            className="w-full p-2 border rounded mt-1"
            value={formData.tournamentName}
            disabled
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
              onClick={handleApply}
            >
              Submit Application
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ApplyModal;

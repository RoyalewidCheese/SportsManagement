import { useState, useEffect } from "react";
import axios from "axios";

const CouncilManagement = () => {
  const [councilMembers, setCouncilMembers] = useState([]);

  // Fetch council members
  useEffect(() => {
    fetchCouncilMembers();
  }, []);

  const fetchCouncilMembers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/users?role=SportsCouncil"); // ✅ Fetch only council members
      setCouncilMembers(response.data);
    } catch (error) {
      console.error("Error fetching council members:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">🏆 Council Members</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {councilMembers.length > 0 ? (
          councilMembers.map((member) => (
            <div key={member._id} className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center">
              <img 
                src={member.image ? `http://localhost:8000${member.image}` : "https://via.placeholder.com/150"} 
                alt={member.name} 
                className="w-24 h-24 object-cover rounded-full mb-3"
              />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
              <p className="text-gray-500">{member.email}</p> {/* ✅ Display email */}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No council members found.</p>
        )}
      </div>
    </div>
  );
};

export default CouncilManagement;
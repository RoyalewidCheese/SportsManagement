import { useEffect, useState } from "react";
import axios from "axios";

const CouncilList = () => {
  const [council, setCouncil] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/council")
      .then((res) => setCouncil(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">🏆 Council Members</h1>
      
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-900 text-white">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {council.length > 0 ? (
              council.map((member) => (
                <tr key={member._id} className="border-t border-gray-300 hover:bg-gray-100 transition">
                  <td className="p-3">{member.name}</td>
                  <td className="p-3">{member.role}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center p-4 text-gray-500">
                  No council members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CouncilList;
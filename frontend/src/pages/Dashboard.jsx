import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    const fetchTournaments = async () => {
      const { data } = await axios.get("http://localhost:8000/api/tournaments");
      setTournaments(data);
    };
    fetchTournaments();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold">{tournament.name}</h2>
            <p>{tournament.location}</p>
            <p>{new Date(tournament.date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
import { useEffect, useState } from "react";
import axios from "axios";

const Athletes = () => {
  const [athletes, setAthletes] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [category, setCategory] = useState("");
  const [achievements, setAchievements] = useState("");

  useEffect(() => {
    fetchAthletes();
  }, []);

  const fetchAthletes = async () => {
    const { data } = await axios.get("http://localhost:8000/api/athletes");
    setAthletes(data);
  };

  const handleAddAthlete = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:8000/api/athletes", { name, age, category, achievements });
    fetchAthletes();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Athletes</h1>
      <form onSubmit={handleAddAthlete} className="mb-4">
        <input type="text" placeholder="Name" className="border p-2 mr-2" onChange={(e) => setName(e.target.value)} required />
        <input type="number" placeholder="Age" className="border p-2 mr-2" onChange={(e) => setAge(e.target.value)} required />
        <input type="text" placeholder="Category" className="border p-2 mr-2" onChange={(e) => setCategory(e.target.value)} required />
        <input type="text" placeholder="Achievements" className="border p-2 mr-2" onChange={(e) => setAchievements(e.target.value)} required />
        <button className="bg-blue-500 text-white px-4 py-2">Add Athlete</button>
      </form>
      <ul>
        {athletes.map((athlete) => (
          <li key={athlete.id} className="border p-2 mb-2">{athlete.name} - {athlete.category}</li>
        ))}
      </ul>
    </div>
  );
};

export default Athletes;
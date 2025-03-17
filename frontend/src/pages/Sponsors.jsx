import { useEffect, useState } from "react";
import axios from "axios";

const Sponsors = () => {
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    const { data } = await axios.get("http://localhost:8000/api/sponsors");
    setSponsors(data);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Sponsors</h1>
      <ul>
        {sponsors.map((sponsor) => (
          <li key={sponsor.id} className="border p-2 mb-2">
            {sponsor.name} - {sponsor.company}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sponsors;
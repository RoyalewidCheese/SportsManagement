import { Link } from "react-router-dom";

const AthleteNavbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">🏅 Athlete Panel</h1>
        <div>
        <Link to="/athletes/dashboard" className="px-4 hover:underline">Dashboard</Link>
          <Link to="/athletes/winners" className="px-4 hover:underline">Winners</Link>
          <Link to="/athletes/applications" className="px-4 hover:underline">Applications</Link>
          <Link to="/athletes/sponsorships" className="px-4 hover:underline">Sponsorships</Link>
          <Link to="/login" className="px-4 bg-red-500 py-2 rounded">Logout</Link>
        </div>
      </div>
    </nav>
  );
};

export default AthleteNavbar;
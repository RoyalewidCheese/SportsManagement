import { Link } from "react-router-dom";

const SponsorNavbar = () => {
  return (
    <nav className="bg-green-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">💰 Sponsor Panel</h1>
        <div>
          <Link to="/sponsor/dashboard" className="px-4 hover:underline">Dashboard</Link>
          <Link to="/sponsor/athletes" className="px-4 hover:underline">View Athletes</Link>
          <Link to="/sponsor/requests" className="px-4 hover:underline">Requests</Link>
          <Link to="/login" className="px-4 bg-red-500 py-2 rounded">Logout</Link>
        </div>
      </div>
    </nav>
  );
};

export default SponsorNavbar;
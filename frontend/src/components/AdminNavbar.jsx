import { Link } from "react-router-dom";

const AdminNavbar = ({ setActiveSection }) => {
  return (
    <nav className="bg-gray-900 p-4">
      <div className="flex justify-center space-x-6">
        <button className="text-white px-4 py-2 hover:bg-gray-700 rounded" onClick={() => setActiveSection("athletes")}>Athletes</button>
        <button className="text-white px-4 py-2 hover:bg-gray-700 rounded" onClick={() => setActiveSection("sponsors")}>Sponsors</button>
        <button className="text-white px-4 py-2 hover:bg-gray-700 rounded" onClick={() => setActiveSection("council")}>Council</button>
        <button className="text-white px-4 py-2 hover:bg-gray-700 rounded" onClick={() => setActiveSection("institutions")}>Institutions</button>
        <button className="text-white px-4 py-2 hover:bg-gray-700 rounded" onClick={() => setActiveSection("tournaments")}>Tournaments</button>
        <Link to="/login" className="px-4 bg-red-500 py-2 rounded">Logout</Link>
      </div>
    </nav>
  );
};

export default AdminNavbar;

import { Link } from "react-router-dom";

const InstitutionNavbar = () => {
  return (
    <nav className="bg-yellow-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">🏫 Institution Panel</h1>
        <div>
          <Link to="/institution/dashboard" className="px-4 hover:underline">Dashboard</Link>
          <Link to="/institution/register-athlete" className="px-4 hover:underline">Register Athletes</Link>
          <Link to="/institution/monitor-participation" className="px-4 hover:underline">Monitor Participation</Link>
          <Link to="/login" className="px-4 bg-red-500 py-2 rounded">Logout</Link>
        </div>
      </div>
    </nav>
  );
};

export default InstitutionNavbar;
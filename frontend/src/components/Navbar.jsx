import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="text-2xl font-bold">🏆 Sports Council</h1>
      <div>
        <Link to="/dashboard" className="px-4">Dashboard</Link>
        <Link to="/athletes" className="px-4">Athletes</Link>
        <Link to="/sponsors" className="px-4">Sponsors</Link>
        <Link to="/feedback" className="px-4">Feedback</Link>
        <Link to="/login" className="px-4 bg-gray-900 py-2 rounded">Logout</Link>
      </div>
    </nav>
  );
};

export default Navbar;
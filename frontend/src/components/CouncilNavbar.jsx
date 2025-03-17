import { Link } from "react-router-dom";

const CouncilNavbar = () => {
  return (
    <nav className="bg-purple-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">🏆 Council Panel</h1>
        <div>
          <Link to="/council/dashboard" className="px-4 hover:underline">Dashboard</Link>
          <Link to="/manage/tournaments" className="px-4 hover:underline">Tournaments</Link>
          <Link to="/manage/applications" className="px-4 hover:underline">Applications</Link>
          <Link to="/manage/winners" className="px-4 hover:underline">Winners</Link>
          <Link to="/login" className="px-4 bg-red-500 py-2 rounded">Logout</Link>
        </div>
      </div>
    </nav>
  );
};

export default CouncilNavbar;
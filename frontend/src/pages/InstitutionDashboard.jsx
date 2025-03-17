import InstitutionNavbar from "../components/InstitutionNavbar";

const InstitutionDashboard = () => {
  return (
    <div>
      <InstitutionNavbar />
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 text-center">🏫 Institution Dashboard</h2>
        <p className="text-gray-600 text-center mt-4">
          Welcome to the Institution Dashboard. Here you can manage athletes, view tournaments, and register new athletes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold">Register Athlete</h3>
            <p className="mt-2">Add new athletes to the system.</p>
            <a href="/institution/register-athlete" className="block bg-white text-blue-500 px-4 py-2 mt-4 rounded-md">Register Now</a>
          </div>

          <div className="bg-blue-700 text-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold">View Athletes</h3>
            <p className="mt-2">See a list of all registered athletes.</p>
            <a href="/institution/athletes" className="block bg-white text-blue-500 px-4 py-2 mt-4 rounded-md">View Athletes</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDashboard;

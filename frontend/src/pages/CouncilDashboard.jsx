import Navbar from "../components/CouncilNavbar";
import CouncilManagement from "../components/CouncilManagement";
import CouncilNavbar from "../components/CouncilNavbar";

const CouncilDashboard = () => {
  return (
    <div>
      <CouncilNavbar />
      <div className="p-6">
      <CouncilManagement />
      </div>
    </div>
  );
};

export default CouncilDashboard;
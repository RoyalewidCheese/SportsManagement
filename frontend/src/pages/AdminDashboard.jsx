import { useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import AdminAthletes from "./AdminAthletes";
import AdminSponsors from "./AdminSponsors";
import AdminCouncil from "./AdminCouncil";
import AdminInstitutions from "./AdminInstitutions";
import AdminTournaments from "./AdminTournaments";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("athletes");

  return (
    <div>
      <AdminNavbar setActiveSection={setActiveSection} />
      <div className="max-w-6xl mx-auto p-6">

        {/* Render section based on selected tab */}
        {activeSection === "athletes" && <AdminAthletes />}
        {activeSection === "sponsors" && <AdminSponsors />}
        {activeSection === "council" && <AdminCouncil />}
        {activeSection === "institutions" && <AdminInstitutions />}
        {activeSection === "tournaments" && <AdminTournaments />}
      </div>
    </div>
  );
};

export default AdminDashboard;

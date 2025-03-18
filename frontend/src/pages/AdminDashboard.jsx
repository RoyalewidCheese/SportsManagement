import { useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import AdminAthletes from "./AdminAthletes";
import AdminSponsors from "./AdminSponsors";
import AdminCouncil from "./AdminCouncil";
import AdminInstitutions from "./AdminInstitutions";
import AdminTournaments from "./AdminTournaments";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("athletes");

  // Get current date and time
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Helper function to get title for current section
  const getSectionTitle = () => {
    const titles = {
      athletes: "Athletes Management",
      sponsors: "Sponsors Management",
      council: "Sports Council Management",
      institutions: "Institutions Management",
      tournaments: "Tournaments Management"
    };
    return titles[activeSection] || "";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminNavbar setActiveSection={setActiveSection} activeSection={activeSection} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header with title and date */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{getSectionTitle()}</h1>
              <p className="text-gray-500">{currentDate}</p>
            </div>
            
            {/* Profile section */}
            <div className="flex items-center">
              <div className="mr-4 text-right">
                <p className="font-medium">Admin User</p>
                <p className="text-sm text-gray-500">admin@sportsapp.com</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="bg-white rounded-lg shadow-sm p-1">
            {activeSection === "athletes" && <AdminAthletes />}
            {activeSection === "sponsors" && <AdminSponsors />}
            {activeSection === "council" && <AdminCouncil />}
            {activeSection === "institutions" && <AdminInstitutions />}
            {activeSection === "tournaments" && <AdminTournaments />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
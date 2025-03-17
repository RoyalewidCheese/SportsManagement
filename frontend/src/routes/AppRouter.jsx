import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AthletesDashboard from "../pages/AthletesDashboard";
import AthleteSponsorships from "../pages/AthletesSponsorships";
import SponsorDashboard from "../pages/SponsorDashboard";
import CouncilDashboard from "../pages/CouncilDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import AdminAthletes from "../pages/AdminAthletes";
import AdminSponsors from "../pages/AdminSponsors";
import AdminCouncil from "../pages/AdminCouncil";
import CouncilTournaments from "../pages/CouncilTournaments";
import CouncilWinners from "../pages/CouncilWinners";
import CouncilApplications from "../pages/CouncilApplications";
import AthleteApplications from "../pages/AthleteApplications";
import AthleteWinners from "../pages/AthleteWinner";
import SponsorRequests from "../pages/SponsorRequests";
import InstitutionDashboard from "../pages/InstitutionDashboard";
import InstitutionRegister from "../pages/InstitutionRegister";
import InstitutionAthletes from "../pages/InstitutionAthletes";
import InstitutionMonitoring from "../pages/InstitutionMonitoring";
import SponsorViewAthletes from "../pages/SponsorViewAthletes";


const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/athletes/dashboard" element={<AthletesDashboard />} />
        <Route path="/athletes/sponsorships" element={<AthleteSponsorships />} />
        <Route path="/athletes/applications" element={<AthleteApplications/>}/>
        <Route path="/sponsor/dashboard" element={<SponsorDashboard />} />
        <Route path="/council/dashboard" element={<CouncilDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/athletes" element={<AdminAthletes />} />
        <Route path="/admin/sponsors" element={<AdminSponsors />} />
        <Route path="/admin/council" element={<AdminCouncil />} />
        <Route path="/manage/tournaments" element={<CouncilTournaments />} />
        <Route path="/manage/winners" element={<CouncilWinners />} />
        <Route path="/manage/applications" element={<CouncilApplications />} />
        <Route path="/athletes/winners" element={<AthleteWinners />} />
        <Route path="/sponsor/requests" element={<SponsorRequests/>}/>
        <Route path="/institution/dashboard" element={<InstitutionDashboard/>}/>
        <Route path="/institution/register-athlete" element={<InstitutionRegister/>}/>
        <Route path="/institution/athletes" element={<InstitutionAthletes/>}/>
        <Route path="/institution/monitor-participation" element={<InstitutionMonitoring/>}/>
        <Route path="/sponsor/athletes" element={<SponsorViewAthletes/>}/>
      </Routes>
    </Router>
  );
};

export default AppRouter;
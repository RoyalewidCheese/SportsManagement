import SponsorNavbar from "../components/SponsorNavbar";

const SponsorDashboard = () => {
  return (
    <div>
      <SponsorNavbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold">💰 Sponsor Dashboard</h1>
        <p>Manage sponsorships and review applications.</p>
      </div>
    </div>
  );
};

export default SponsorDashboard;
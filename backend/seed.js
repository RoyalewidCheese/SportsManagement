const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Council = require("./models/Council");
const Sponsor = require("./models/Sponsor");
const Athlete = require("./models/Athlete");
const Institution = require("./models/Institution");

dotenv.config();

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedDatabase = async () => {
  try {
    console.log("🛠️ Seeding Database...");

    // ✅ Clear existing data
    await Council.deleteMany();
    await Sponsor.deleteMany();
    await Athlete.deleteMany();
    await Institution.deleteMany();

    // ✅ Sample Council Members
    const councilMembers = [
      { name: "John Doe", role: "Event Manager" },
      { name: "Sarah Smith", role: "Sports Coordinator" },
      { name: "Mike Johnson", role: "Sponsorship Head" },
      { name: "Emma Brown", role: "Athlete Manager" },
      { name: "James Wilson", role: "Logistics Head" }
    ];

    // ✅ Sample Sponsors
    const sponsors = [
      { name: "Nike", company: "Nike Inc.", sponsorshipDetails: "Sports gear sponsorship" },
      { name: "Adidas", company: "Adidas AG", sponsorshipDetails: "Athlete performance wear" },
      { name: "Puma", company: "Puma SE", sponsorshipDetails: "Footwear and accessories" },
      { name: "Under Armour", company: "Under Armour Inc.", sponsorshipDetails: "Training equipment" },
      { name: "Reebok", company: "Reebok International", sponsorshipDetails: "Athlete funding program" }
    ];

    // ✅ Sample Athletes
    const athletes = [
      { name: "Usain Bolt", age: 37, category: "Sprinter", achievements: "Olympic Gold Medalist" },
      { name: "Serena Williams", age: 42, category: "Tennis", achievements: "Olympic Gold Medalist" },
      { name: "Lionel Messi", age: 36, category: "Football", achievements: "FIFA World Cup Winner" },
      { name: "Michael Phelps", age: 38, category: "Swimming", achievements: "World Record Holder" },
      { name: "Simone Biles", age: 27, category: "Gymnastics", achievements: "4 Olympic Gold Medals" }
    ];

    // ✅ Sample Institutions
    const institutions = [
      { name: "Harvard University", location: "Cambridge, MA" },
      { name: "Stanford University", location: "Stanford, CA" },
      { name: "MIT", location: "Cambridge, MA" },
      { name: "Oxford University", location: "Oxford, UK" },
      { name: "Tokyo University", location: "Tokyo, Japan" }
    ];

    // ✅ Insert Data into Database
    await Council.insertMany(councilMembers);
    await Sponsor.insertMany(sponsors);
    await Athlete.insertMany(athletes);
    await Institution.insertMany(institutions);

    console.log("✅ Database Seeding Completed Successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("🔥 Seeding Error:", error);
    mongoose.connection.close();
  }
};

// ✅ Run Seeder
seedDatabase();
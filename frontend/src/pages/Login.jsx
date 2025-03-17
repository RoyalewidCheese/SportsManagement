import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
        const response = await fetch("http://localhost:8000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: credentials.email.trim(),
                password: credentials.password,
            }),
        });

        const data = await response.json();
        console.log("🔹 Server Response:", data);

        if (!response.ok) throw new Error(data.msg || "❌ Login failed");

        // ✅ Store auth token
        localStorage.setItem("authToken", data.token);

        // ✅ Decode JWT token to extract user role & institution ID
        const decodedToken = JSON.parse(atob(data.token.split(".")[1]));
        const userRole = decodedToken.user.role;
        const instituteId = decodedToken.user.instituteId || null;

        console.log("📥 Extracted `instituteId`:", instituteId);

        // ✅ If the user is an Institution, store `institutionId`
        if (userRole === "Institution" && instituteId) {
            localStorage.setItem("instituteId", instituteId);
            console.log("✅ Stored `institutionId` in localStorage:", instituteId);
        } else {
            console.warn("⚠️ No `institutionId` found in token for this user.");
        }

        // ✅ Redirect based on role
        switch (userRole) {
            case "Admin":
                navigate("/admin/dashboard");
                break;
            case "Athlete":
                navigate("/athletes/dashboard");
                break;
            case "Sponsor":
                navigate("/sponsor/dashboard");
                break;
            case "SportsCouncil":
                navigate("/council/dashboard");
                break;
            case "Institution":
                navigate("/institution/dashboard");
                break;
            default:
                navigate("/login");
                break;
        }
    } catch (error) {
        setError(error.message);
        console.error("🔥 Login Error:", error);
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-green-500 p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-800">🏆 Sports Council Login</h1>
          <p className="text-gray-600 mt-1">Manage athletes, events & more</p>
        </div>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Email</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-4 text-gray-400" />
              <input type="email" name="email" placeholder="Enter your email" className="w-full p-3 pl-10 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" required onChange={handleChange} />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-4 text-gray-400" />
              <input type="password" name="password" placeholder="Enter your password" className="w-full p-3 pl-10 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none" required onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            New here?{" "}
            <span className="text-blue-600 font-bold hover:underline cursor-pointer" onClick={() => navigate("/register")}>
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

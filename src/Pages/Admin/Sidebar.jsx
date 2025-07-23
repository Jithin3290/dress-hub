import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Context/AuthContext";
import axios from "axios";
//The Sidebar component provides navigation for the admin panel using setSection
function Sidebar({ setSection }) {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext); 
  const handleLogout = () => {
    sessionStorage.removeItem("user");
   axios.patch(`http://localhost:3000/admin/admin123`, { login: false,isAdmin: false });

    setUser(null)
    navigate("/login");
  };

  return (
    <div className="w-64 min-h-screen bg-white shadow-md border-r p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Panel</h2>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => setSection("dashboard")}
              className="block w-full text-left text-gray-700 hover:text-blue-600 transition"
            >
              📊 Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => setSection("products")}
              className="block w-full text-left text-gray-700 hover:text-blue-600 transition"
            >
              🛍️ Manage Products
            </button>
          </li>
          <li>
            <button
              onClick={() => setSection("orders")}
              className="block w-full text-left text-gray-700 hover:text-blue-600 transition"
            >
              📦 Manage Orders
            </button>
          </li>
          <li>
            <button
              onClick={() => setSection("users")}
              className="block w-full text-left text-gray-700 hover:text-blue-600 transition"
            >
              👥 Manage Users
            </button>
          </li>
        </ul>
      </div>

      <button
        onClick={handleLogout}
        className="mt-8 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded shadow"
      >
        🔓 Logout
      </button>
    </div>
  );
}

export default Sidebar;

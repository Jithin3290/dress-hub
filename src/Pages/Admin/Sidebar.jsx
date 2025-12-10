import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../Redux/Slices/authSlice";

function Sidebar({ setSection }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (err) {
      console.error("Logout error:", err);
    }

    navigate("/login", { replace: true });
  };

  return (
    <div className="w-64 min-h-screen bg-white shadow-md border-r p-6 flex flex-col justify-between">

      {/* TITLE */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Panel</h2>

        {/* MENU */}
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

      {/* LOGOUT BUTTON */}
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

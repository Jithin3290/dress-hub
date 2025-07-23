import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ManageProducts from "./ManageProducts";
import ManageOrders from "./ManageOrders";
import ManageUsers from "./ManageUsers";
import AdminHome from "./AdminHome";

function AdminDashboard() {
  const [section, setSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Wrap setSection to auto close sidebar on mobile
  const handleSectionChange = (sectionName) => {
    setSection(sectionName);
    setSidebarOpen(false); // Auto-close on mobile
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center px-4 py-3 bg-white shadow-md">
        <h2 className="text-xl font-semibold">Admin Panel</h2>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-600 focus:outline-none"
        >
          {sidebarOpen ? "✖️" : "☰"}
        </button>
      </div>

      <div
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-white shadow-md z-20 md:relative absolute h-full`}
      >
        <Sidebar setSection={handleSectionChange} />
      </div>
        {/* section: controls which admin section is currently shown */}
      <div className="flex-1 p-4 md:p-6 bg-gray-100 overflow-y-auto">
        {section === "dashboard" && <AdminHome />}
        {section === "products" && <ManageProducts />}
        {section === "orders" && <ManageOrders />}
        {section === "users" && <ManageUsers />}
      </div>
    </div>
  );
}

export default AdminDashboard;

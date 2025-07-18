import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ManageProducts from "./ManageProducts";
import ManageOrders from "./ManageOrders";
import ManageUsers from "./ManageUsers";
import AdminHome from "./AdminHome"; // New Dashboard Overview

function AdminDashboard() {
  const [section, setSection] = useState("dashboard");


  return (
    <div className="flex h-screen">
      <Sidebar setSection={setSection} />
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        {section === "dashboard" && <AdminHome />}
        {section === "products" && <ManageProducts />}
        {section === "orders" && <ManageOrders />}
        {section === "users" && <ManageUsers />}
      </div>
    </div>
  );
}

export default AdminDashboard;

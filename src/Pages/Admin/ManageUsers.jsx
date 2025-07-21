// src/Pages/Admin/ManageUsers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/user");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:3000/user/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const toggleBlockUser = async (id, isBlocked) => {
    try {
      await axios.patch(`http://localhost:3000/user/${id}`, {
        blocked: !isBlocked,
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, blocked: !isBlocked } : u
        )
      );
    } catch (err) {
      console.error("Failed to toggle block status", err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Users</h2>
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => toggleBlockUser(user.id, user.blocked)}
                    className={`px-3 py-1 rounded text-white ${
                      user.blocked
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-yellow-500 hover:bg-yellow-600"
                    }`}
                  >
                    {user.blocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageUsers;

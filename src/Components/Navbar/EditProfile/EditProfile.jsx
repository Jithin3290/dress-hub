import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function EditProfile() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(`http://localhost:3000/user/${user.id}`, formData);
      setUser(res.data);
      sessionStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Profile updated");
      navigate("/");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 px-6 py-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-center text-pink-600 mb-6">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          placeholder="Email"
          required
        />
        <button type="submit" className="bg-pink-600 text-white py-2 rounded hover:bg-pink-700">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditProfile;

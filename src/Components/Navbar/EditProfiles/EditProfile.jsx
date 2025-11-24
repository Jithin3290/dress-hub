// src/pages/EditProfile.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { updateProfile, setUser } from "../../../Redux/Slices/authSlice"; // adjust
import { buildImageUrl } from "../../../utils/image"; // adjust

export default function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, saving } = useSelector((state) => state.auth);

  const ssUser = (() => {
    try {
      const raw = sessionStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const initial = user ?? ssUser ?? { name: "", email: "", phone_number: "" };

  const [formData, setFormData] = useState({
    name: initial.name || "",
    email: initial.email || "",
    phone_number: initial.phone_number || "",
  });
  const [file, setFile] = useState(null);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
      });
    } else if (ssUser) {
      dispatch(setUser(ssUser));
      setFormData({
        name: ssUser.name || "",
        email: ssUser.email || "",
        phone_number: ssUser.phone_number || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleFile = (e) => {
    setFile(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!user && !ssUser) {
      toast.error("Not logged in, please log in and retry");
      return;
    }

    // Build FormData (backend expects profile_picture + fields)
    const payload = {};
    // include fields even if empty so serializer partial patch works - optional
    if (formData.name !== undefined) payload.name = formData.name;
    if (formData.email !== undefined) payload.email = formData.email;
    if (formData.phone_number !== undefined) payload.phone_number = formData.phone_number;

    if (file) payload.profile_picture = file;

    try {
      const resultAction = await dispatch(updateProfile({ data: payload, multipart: !!file }));

      if (updateProfile.fulfilled.match(resultAction)) {
        const updated = resultAction.payload.user ?? resultAction.payload;
        sessionStorage.setItem("user", JSON.stringify(updated));
        dispatch(setUser(updated));
        toast.success("Profile updated");
        navigate("/");
      } else {
        const err = resultAction.payload ?? resultAction.error;
        const message = typeof err === "string" ? err : JSON.stringify(err);
        setLocalError(message);
        toast.error("Update failed");
      }
    } catch (err) {
      setLocalError(err.message || "Update failed");
      toast.error("Update failed");
    }
  };

  const avatarUrl = buildImageUrl(user?.profile_picture ?? ssUser?.profile_picture);

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

        <input
          type="text"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          placeholder="Phone number"
        />

        <div>
          <label className="block text-sm mb-1">Profile picture (optional)</label>
          <input type="file" accept="image/*" onChange={handleFile} />
          {avatarUrl && (
            <div className="mt-2">
              <img src={avatarUrl} alt="avatar" style={{ width: 80 }} />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {localError && <p className="text-red-600 text-sm mt-2">{localError}</p>}
      </form>
    </div>
  );
}

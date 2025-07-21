import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Contact() {
    const nav = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thanks for contacting us!');
    nav("/")
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-purple-700">Contact Us</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          type="text"
          placeholder="Your Name"
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
          required
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          placeholder="Your Email"
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
          required
        />
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Your Message"
          rows="5"
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
          required
        />
        <button
          type="submit"
          className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

export default Contact;

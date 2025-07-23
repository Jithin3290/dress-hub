import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Careers() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (!user) {
       navigate("/login");
    }
  }, []);

  return (
    <div className="bg-white text-gray-800 px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* Hero Section */}
        <section className="text-center">
          <h1 className="text-5xl font-bold text-purple-700 mb-4">Careers at DressHub</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join a fashion-forward team driven by creativity, collaboration, and passion for impact.
          </p>
        </section>

        {/* Culture Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-semibold mb-4">Why Work With Us?</h2>
            <ul className="list-disc list-inside space-y-3 text-lg text-gray-700">
              <li>Flexible, inclusive & growth-driven work environment</li>
              <li>Competitive pay and performance rewards</li>
              <li>Remote-friendly and hybrid team options</li>
              <li>Creative freedom and project ownership</li>
              <li>Discounts on all DressHub products!</li>
            </ul>
          </div>
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80"
            alt="Team Culture"
            className="rounded-xl shadow-md object-cover w-full max-h-80"
          />
        </section>

        {/* Openings Preview */}
        <section>
          <h2 className="text-3xl font-semibold text-center mb-8">We're Hiring In</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              { role: 'Fashion Designers', icon: '🧵' },
              { role: 'Frontend Developers', icon: '💻' },
              { role: 'Customer Support', icon: '📞' },
              { role: 'Marketing Strategists', icon: '📈' },
              { role: 'Supply Chain Analysts', icon: '🚚' },
              { role: 'Content Creators', icon: '🎨' }
            ].map((item, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg p-6 shadow hover:shadow-lg transition"
              >
                <div className="text-4xl mb-2">{item.icon}</div>
                <h3 className="text-lg font-semibold">{item.role}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-purple-50 p-8 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold mb-2 text-purple-700">Think you're a great fit?</h3>
          <p className="text-gray-700 mb-4">
            We'd love to hear from you. Reach out to us with your resume or portfolio!
          </p>
          <a
            href="mailto:careers@dresshub.com"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full transition"
          >
            Apply Now
          </a>
        </section>
      </div>
    </div>
  );
}

export default Careers;

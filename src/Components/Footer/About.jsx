import React from "react";

function About() {
  return (
    <div className="bg-white text-gray-800 px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-16">
     
        <section className="text-center">
          <h1 className="text-5xl font-bold text-purple-700 mb-4">
            About DressHub
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            At <span className="font-semibold">DressHub</span>, we redefine
            fashion by merging style with comfort. We are more than just a
            clothing brand — we're a lifestyle movement for those who love to
            stand out.
          </p>
        </section>

      
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-semibold mb-4 text-purple-700">
              Our Mission
            </h2>
            <p className="text-gray-600 text-lg">
              To empower people through expressive fashion choices that reflect
              personality, confidence, and comfort. We aim to make high-quality,
              trendy, and sustainable clothing accessible to everyone.
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700 text-left">
              <li>Inclusivity in fashion</li>
              <li>Sustainable sourcing & production</li>
              <li>Customer-first approach</li>
              <li>Continuous innovation</li>
            </ul>
          </div>
          <div className="flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80"
              alt="Fashion Mission"
              className="rounded-xl shadow-md w-full max-w-sm object-cover"
            />
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold text-center text-purple-700 mb-8">
            Our Journey
          </h2>
          <div className="space-y-6">
            <div className="border-l-4 border-purple-500 pl-6">
              <h4 className="text-xl font-semibold">2025 — Launch</h4>
              <p className="text-gray-600">
                DressHub was born with a goal to bring runway fashion to
                everyday wardrobes.
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-6">
              <h4 className="text-xl font-semibold">
                2026 — 10,000+ Happy Customers
              </h4>
              <p className="text-gray-600">
                Our customer base exploded as word spread about our affordable,
                quality collections.
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-6">
              <h4 className="text-xl font-semibold">2027 — Expansion</h4>
              <p className="text-gray-600">
                We launched kids' and accessories lines, and began international
                shipping.
              </p>
            </div>
          </div>
        </section>

   
        <section className="bg-purple-50 p-8 rounded-xl shadow-md">
          <h2 className="text-3xl font-semibold text-purple-700 mb-4">
            What We Promise
          </h2>
          <p className="text-gray-700 text-lg max-w-4xl mx-auto">
            We promise to always listen to our community, deliver innovative
            fashion solutions, and inspire confidence through our products. Your
            satisfaction fuels our journey.
          </p>
        </section>

        <section className="text-center mt-10">
          <h3 className="text-2xl font-semibold text-gray-800">
            Ready to discover your next look?
          </h3>
          <p className="text-gray-600 mb-4">
            Explore our latest collections and see why thousands choose
            DressHub.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
          >
            Shop Now
          </a>
        </section>
      </div>
    </div>
  );
}

export default About;

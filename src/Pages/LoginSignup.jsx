import React from 'react';

function LoginSignup() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-100 to-teal-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name"
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="email"
            placeholder="Email Address"
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <button className="bg-pink-500 text-white p-3 rounded-md hover:bg-pink-600 transition">
            Continue
          </button>

          <p className="text-sm text-center">
            Already have an account?{' '}
            <span className="text-pink-600 cursor-pointer hover:underline">
              Login here
            </span>
          </p>

          <div className="flex items-start gap-2 text-xs text-gray-600 mt-2">
            <input type="checkbox" id="terms" />
            <label htmlFor="terms">
              By continuing, I agree to the{' '}
              <span className="text-blue-600 underline cursor-pointer">
                terms and conditions
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginSignup;

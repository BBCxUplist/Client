import React, { useState } from "react";

export const Footer = () => {
  const [email, setEmail] = useState("");

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email subscription logic here
    console.log("Email subscription:", email);
    setEmail("");
  };

  return (
    <footer className="bg-neutral-800 text-neutral-100 mt-auto w-full">
      <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-3">
              <img src="/logo/logo.png" alt="Uplist" className="h-8 w-8" />
              <span className="text-xl font-bold text-neutral-100">UPlist</span>
            </div>
            <p className="text-sm text-neutral-300 max-w-md mx-auto md:mx-0">
              Connect with talented musicians and book live performances for
              your events. Secure payments, verified artists, and unforgettable
              experiences.
            </p>
          </div>

          {/* Email Subscription */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-neutral-100 mb-3">
              Stay Updated
            </h3>
            <p className="text-sm text-neutral-300 mb-3">
              Get the latest updates and exclusive offers delivered to your
              inbox.
            </p>
            <form
              onSubmit={handleEmailSubmit}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-xl text-sm bg-neutral-700 border border-neutral-600 text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-orange-500 transition-colors"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-neutral-700">
          <p className="text-sm text-neutral-400 text-center">
            © 2024 UPlist. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

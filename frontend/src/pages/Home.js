import React from "react";
import { Link } from "react-router-dom";
import FeaturesGrid from "../components/UI/FeaturresGrid";
import StepsGrid from "../components/UI/StepsGrid";
import { useAuth } from "../context/AuthContext";

function Home() {
  const auth = useAuth();
  const loggedIn = Boolean(auth?.isAuthenticated ?? auth?.user);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Secure Real-Time Monitoring Service
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Stay connected to your space even when you're away. Monitor securely
            through your web browser.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to={loggedIn ? "/dashboard" : "/login"}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              {loggedIn ? "Go to Dashboard" : "Get Started"}
            </Link>
            {!loggedIn && (
              <Link
                to="/signup"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium border border-blue-600 hover:bg-blue-50"
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <FeaturesGrid />
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

        <StepsGrid />
      </div>
    </div>
  );
}

export default Home;

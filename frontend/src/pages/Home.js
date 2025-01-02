import React from "react";
import { Link } from "react-router-dom";
import { Shield, Video, Bell, Lock } from "lucide-react";

function Home() {
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
              to="/login"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              Get Started
            </Link>
            <Link
              to="/signup"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium border border-blue-600 hover:bg-blue-50"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Video className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Live Streaming</h3>
            <p className="text-gray-600">
              Access real-time video through your web browser
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Bell className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Motion Detection</h3>
            <p className="text-gray-600">
              Receive instant alerts when movement is detected
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Lock className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Secure Access</h3>
            <p className="text-gray-600">
              Access limited to authenticated users only
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Shield className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Safe Storage</h3>
            <p className="text-gray-600">
              Securely store all detected event logs
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold text-xl">1</span>
            </div>
            <h3 className="font-semibold mb-2">Sign Up</h3>
            <p className="text-gray-600">Start with a simple registration</p>
          </div>

          <div>
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold text-xl">2</span>
            </div>
            <h3 className="font-semibold mb-2">Connect Camera</h3>
            <p className="text-gray-600">
              Allow webcam access and start streaming
            </p>
          </div>

          <div>
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold text-xl">3</span>
            </div>
            <h3 className="font-semibold mb-2">Monitor</h3>
            <p className="text-gray-600">View live feed from any device</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

import React from "react";
import { Camera, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { authService } from "../../services/authService";
import Button from "./Button";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Camera className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-grey-800">
              SafeCam
            </span>
          </Link>
          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="px-3 py-2 text-gray-700 hover:text-blue-600"
            >
              Dashboard
            </Link>
            <Link
              to="/monitoring"
              className="px-3 py-2 text-gray-700 hover:text-blue-600"
            >
              Monitoring
            </Link>
            <Link
              to="/alerts"
              className="px-3 py-2 text-gray-700 hover:text-blue-600"
            >
              Alerts
            </Link>
            <Link
              to="/settings"
              className="px-3 py-2 text-gray-700 hover:text-blue-600"
            >
              Settings
            </Link>
            {isAuthenticated && (
              <Button onClick={handleLogout} variant="secondary">
                Logout
              </Button>
            )}
          </div>
          {/* Mobile */}
          <div className="md:hidden">
            <button>
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Header;

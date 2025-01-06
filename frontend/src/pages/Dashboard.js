import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DeviceCard from "../components/UI/DeviceCard";
import RecentActivity from "../components/UI/RecentActivity";
import { deviceService } from "../services/deviceService";
import { activityService } from "../services/activityService";

function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("No token found, redirecting to login");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const devicesData = await deviceService.fetchMyDevices();
        setDevices(devicesData);
        const activitiesData = await activityService.fetchRecentActivities();
        console.log("Activities data received:", activitiesData);
        setActivities(activitiesData);
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header with Quick Actions */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="space-x-4">
          <Link
            to="/user/devices"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Device
          </Link>
          <Link
            to="/user/notifications"
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg"
          >
            Notification Settings
          </Link>
        </div>
      </div>

      {/* Devices Grid */}
      {devices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {devices.map((device) => (
            <DeviceCard
              key={device.deviceId}
              device={device}
              onStartMonitoring={(id) => navigate(`user/devices/${id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">My Devices</h2>
          <p>No devices</p>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        {activities.length > 0 ? (
          <RecentActivity activities={activities} />
        ) : (
          <p>No recent activities</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

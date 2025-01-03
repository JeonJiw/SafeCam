import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import { Laptop, Smartphone, Tablet, Camera, Monitor } from "lucide-react";

export const deviceIcons = {
  laptop: Laptop,
  smartphone: Smartphone,
  tablet: Tablet,
  camera: Camera,
  monitor: Monitor,
};

const DeviceCard = ({ device, onStartMonitoring }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center gap-4 mb-4">
      {deviceIcons[device.deviceType] &&
        React.createElement(deviceIcons[device.deviceType], {
          size: 24,
          className: "text-blue-600",
        })}
      <h3 className="text-lg font-semibold">{device.deviceName}</h3>
    </div>

    <div className="space-y-2 mb-4">
      <p className="text-sm text-gray-600">Location: {device.location}</p>
      <p className="text-sm text-gray-600">
        Status:{" "}
        {device.cameraEnabled ? (
          <span className="text-green-600">Active</span>
        ) : (
          <span className="text-red-600">Inactive</span>
        )}
      </p>
      <p className="text-sm text-gray-600">
        Recording:{" "}
        {device.recordingEnabled ? (
          <span className="text-green-600">On</span>
        ) : (
          <span className="text-gray-600">Off</span>
        )}
      </p>
      <p className="text-sm text-gray-600">
        Last Active: {new Date(device.lastActiveAt).toLocaleString()}
      </p>
    </div>

    <div className="flex gap-4">
      <Link to={`/devices/${device.deviceId}`}>
        <Button>View Details</Button>
      </Link>
      <Button
        onClick={() => onStartMonitoring(device.deviceId)}
        className={device.cameraEnabled ? "bg-green-600" : "bg-gray-400"}
        disabled={!device.cameraEnabled}
      >
        Start Monitoring
      </Button>
    </div>
  </div>
);

export default DeviceCard;

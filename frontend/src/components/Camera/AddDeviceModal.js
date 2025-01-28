import React, { useState, useEffect } from "react";
import { Camera, X, AlertCircle } from "lucide-react";
import { deviceAPI } from "../../api/devices";

const AddDeviceModal = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentCamera, setCurrentCamera] = useState(null);
  const [formData, setFormData] = useState({
    deviceId: "",
    deviceName: "",
    location: "",
    cameraEnabled: true,
  });

  useEffect(() => {
    const detectCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(
          (device) => device.kind === "videoinput"
        );
        if (cameras.length > 0) {
          const camera = cameras[0];
          setCurrentCamera(camera);
          setFormData((prev) => ({
            ...prev,
            deviceId: camera.deviceId,
          }));
        } else {
          setError("No camera detected");
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setError("Failed to detect camera");
      } finally {
        setLoading(false);
      }
    };

    detectCamera();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const response = await deviceAPI.create(formData);

      if (response.data) {
        onSuccess(response.data);
        onClose();
      }
    } catch (error) {
      console.error("Error registering device:", error);
      setError(error.response?.data?.message || "Failed to register device");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-500" />
            Add New Device
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Detection Status */}
        <div className="mb-4 p-3 rounded-md bg-gray-50">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">
              {loading
                ? "Detecting camera..."
                : currentCamera
                ? `Camera detected: ${currentCamera.label || "Unnamed Camera"}`
                : "No camera detected"}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Device Name
            </label>
            <input
              type="text"
              value={formData.deviceName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, deviceName: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="cameraEnabled"
              checked={formData.cameraEnabled}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  cameraEnabled: e.target.checked,
                }))
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="cameraEnabled"
              className="ml-2 block text-sm text-gray-700"
            >
              Enable Camera
            </label>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={loading || !currentCamera}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300"
            >
              {loading ? "Registering..." : "Register Device"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeviceModal;

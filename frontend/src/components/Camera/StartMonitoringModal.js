import React, { useState, useEffect } from "react";
import { Mail, AlertCircle, Camera } from "lucide-react";
import { monitoringAPI } from "../../api/monitoring";
import { deviceAPI } from "../../api/devices";

const StartMonitoringModal = ({ onClose, onStart }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);

  useEffect(() => {
    const detectCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );

        if (videoDevices.length > 0) {
          const deviceInfo = {
            deviceId: videoDevices[0].deviceId,
            label: videoDevices[0].label,
          };
          console.log(
            "Attempting to find device with ID:",
            deviceInfo.deviceId
          );
          const response = await deviceAPI.findByHardwareId(
            deviceInfo.deviceId
          );

          if (response.data) {
            setConnectedDevice(response.data);
          } else {
            setError("Connected camera is not registered in the system");
          }
        } else {
          setError("No camera detected");
        }
      } catch (error) {
        setError("Failed to access camera");
        console.error("Camera detection error:", error);
      }
    };

    detectCamera();
  }, []);

  const handleStartMonitoring = async () => {
    try {
      setLoading(true);
      setError("");

      if (!connectedDevice) {
        setError("No registered device found");
        return;
      }

      // Generate 6-digit verification code
      const verificationCode = Math.random().toString().slice(2, 8);
      console.log("verificationCode: ", verificationCode);
      // Send monitoring request with device info and verification code
      const response = await monitoringAPI.startMonitoring({
        deviceId: connectedDevice.deviceId,
        verificationCode,
      });
      console.log("response: ", response);

      if (response.data?.success) {
        setVerificationSent(true);
        // Pass both verification code and deviceId to parent component
        onStart(verificationCode, connectedDevice.deviceId);
      } else {
        setError("Failed to start monitoring");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Server error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-500" />
            Start Monitoring
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {!verificationSent ? (
            <>
              <div className="flex items-center gap-2 text-gray-600">
                <Camera className="w-5 h-5" />
                {connectedDevice ? (
                  <div>
                    <p>Connected device: {connectedDevice.deviceName}</p>
                  </div>
                ) : (
                  <p>Detecting connected camera...</p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleStartMonitoring}
                disabled={loading || !connectedDevice}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
              >
                {loading ? "Sending verification code..." : "Start Monitoring"}
              </button>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-4">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <p className="text-gray-600">
                Verification code has been sent to your email.
                <br />
                Starting monitoring session...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartMonitoringModal;

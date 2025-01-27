import React, { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import Streaming from "../components/Camera/Streaming";
import DetectionLog from "../components/Camera/DetectionLog";

const Monitoring = () => {
  const [socket, setSocket] = useState(null);
  const [detectionLogs, setDetectionLogs] = useState([]);
  const [monitoringStatus, setMonitoringStatus] = useState({
    active: false,
    startTime: null,
  });

  useEffect(() => {
    const newSocket = io("http://localhost:3002");
    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.close();
    };
  }, []);

  const handleDetectionAlert = useCallback((data) => {
    setDetectionLogs((prev) =>
      [
        {
          id: Date.now(),
          timestamp: data.timestamp,
          detections: data.detections,
          alertLevel: data.alert_level,
        },
        ...prev,
      ].slice(0, 50)
    );
  }, []);

  const handleMonitoringStatus = useCallback((data) => {
    setMonitoringStatus({
      active: data.status === "active",
      startTime: data.timestamp,
      message: data.message,
    });
  }, []);

  const handleError = useCallback((data) => {
    console.error("Detection error:", data.error);
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("monitoring-status", handleMonitoringStatus);
    socket.on("detection-alert", handleDetectionAlert);
    socket.on("detection-error", handleError);

    return () => {
      socket.off("monitoring-status", handleMonitoringStatus);
      socket.off("detection-alert", handleDetectionAlert);
      socket.off("detection-error", handleError);
    };
  }, [socket, handleMonitoringStatus, handleDetectionAlert, handleError]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Monitoring</h1>
        {monitoringStatus.active && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Monitoring Active
            </span>
            <span className="text-sm text-gray-500">
              Started at{" "}
              {new Date(monitoringStatus.startTime).toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Live Stream</h2>
          <div className="aspect-w-16 aspect-h-9">
            <Streaming socket={socket} />
          </div>
        </div>

        <DetectionLog logs={detectionLogs} />
      </div>
    </div>
  );
};

export default Monitoring;

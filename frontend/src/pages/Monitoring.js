import React, { useState, useEffect, useCallback, useRef } from "react";
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
  const [isInitializing, setIsInitializing] = useState(false);
  const initializationTimer = useRef(null);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_BACKEND_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      path: "/socket.io",
      extraHeaders: {
        "Access-Control-Allow-Origin": "*",
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected with ID:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      console.log("Connection error details:", {
        url: process.env.REACT_APP_BACKEND_URL,
        transport: newSocket.io.engine.transport.name,
      });
    });

    console.log("Setting socket state...");
    setSocket(newSocket);

    return () => {
      if (newSocket) {
        console.log("Cleaning up socket connection");
        newSocket.close();
      }
      if (initializationTimer.current) {
        clearTimeout(initializationTimer.current);
      }
    };
  }, []);

  const handleDetectionAlert = useCallback(
    (data) => {
      if (!isInitializing) {
        console.log("Processing detection alert", data);
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
      } else {
        console.log("Skipping detection alert during initialization");
      }
    },
    [isInitializing]
  );

  const handleMonitoringStatus = useCallback((data) => {
    console.log("handleMonitoringStatus called with data:", data);
    console.log("Current monitoring status:", monitoringStatus);
    console.log("Current initialization state:", isInitializing);

    if (data.status === "active") {
      console.log("Activating monitoring...");
      if (initializationTimer.current) {
        clearTimeout(initializationTimer.current);
      }

      setIsInitializing(true);
      setMonitoringStatus({
        active: true,
        startTime: data.timestamp,
        message: data.message,
      });

      initializationTimer.current = setTimeout(() => {
        console.log("Initialization period ended");
        setIsInitializing(false);
      }, 10000);
    } else {
      console.log("Deactivating monitoring...");
      setMonitoringStatus({
        active: false,
        startTime: null,
        message: data.message,
      });
    }
  }, []);

  const handleError = useCallback((data) => {
    console.error("Detection error:", data.error);
  }, []);

  useEffect(() => {
    if (!socket) return;

    console.log("Setting up socket event listeners...");

    const onMonitoringStatus = (data) => {
      console.log("Raw monitoring-status event received:", data);
      handleMonitoringStatus(data);
    };

    const onDetectionWithDelay = (data) => {
      console.log("Raw detection-alert event received:", data);
      handleDetectionAlert(data);
    };

    const onError = (data) => {
      console.log("Raw error event received:", data);
      handleError(data);
    };

    socket.on("monitoring-status", onMonitoringStatus);
    socket.on("detection-alert", onDetectionWithDelay);
    socket.on("detection-error", onError);

    console.log("Socket event listeners set up successfully");

    return () => {
      console.log("Cleaning up socket event listeners...");
      if (socket) {
        socket.off("monitoring-status", onMonitoringStatus);
        socket.off("detection-alert", onDetectionWithDelay);
        socket.off("detection-error", onError);
      }
    };
  }, [socket, handleMonitoringStatus, handleDetectionAlert, handleError]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Monitoring</h1>
        {monitoringStatus.active && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              {isInitializing ? "Initializing..." : "Monitoring Active"}
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
          {isInitializing && (
            <div className="mt-2 text-sm text-gray-500 text-center">
              Detection will begin in a few seconds...
            </div>
          )}
        </div>

        <DetectionLog logs={detectionLogs} />
      </div>
    </div>
  );
};

export default Monitoring;

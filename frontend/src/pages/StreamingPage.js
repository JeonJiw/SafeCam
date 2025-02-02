import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { monitoringAPI } from "../api/monitoring";

const StreamingPage = () => {
  const { deviceId } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const initializeStream = async () => {
      try {
        // 세션 접근 권한 확인
        await monitoringAPI.getStreamingSession(deviceId);

        // 소켓 연결
        const socket = io(process.env.FRONTEND_URL, {
          query: { deviceId, userId: user.id },
        });

        socket.on("stream-data", (data) => {
          setStream(data);
        });

        socket.on("access-denied", () => {
          setError("You do not have access to this stream");
          navigate("/dashboard");
        });

        // cleanup function
        return () => {
          socket.disconnect();
        };
      } catch (error) {
        console.error("Stream access error:", error);
        if (error.response?.status === 403) {
          navigate("/dashboard");
        }
        setError(error.message || "Access denied or stream not found");
      }
    };

    initializeStream();
  }, [deviceId, isAuthenticated, user, navigate]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Device Monitoring</h1>
      {stream ? (
        <div className="aspect-w-16 aspect-h-9">{/* 스트림 표시 */}</div>
      ) : (
        <div>Loading stream...</div>
      )}
    </div>
  );
};

export default StreamingPage;

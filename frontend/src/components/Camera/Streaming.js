// Streaming.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import StartMonitoringModal from "./StartMonitoringModal";
import StopStreamingModal from "./StopStreamingModal";
import { monitoringAPI } from "../../api/monitoring";

const Streaming = ({ socket }) => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showStopModal, setShowStopModal] = useState(false);
  const [showStartModal, setShowStartModal] = useState(true);
  const [verificationCode, setVerificationCode] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAndResetSession = async () => {
      try {
        await monitoringAPI.resetSession();
      } catch (error) {
        console.error("Error resetting session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAndResetSession();
  }, []);

  const cleanupMediaResources = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsStreaming(false);
    if (socket) {
      socket.emit("streaming-finished");
    }
  }, [socket]);

  const startStreaming = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      videoRef.current.srcObject = stream;
      setIsStreaming(true);

      const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });

      recorder.ondataavailable = async (event) => {
        if (socket) {
          try {
            const videoTrack = stream.getVideoTracks()[0];
            const imageCapture = new ImageCapture(videoTrack);
            const bitmap = await imageCapture.grabFrame();

            const canvas = document.createElement("canvas");
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            const context = canvas.getContext("2d");
            context.drawImage(bitmap, 0, 0);

            canvas.toBlob(
              (blob) => {
                socket.emit("video-frame", blob);
              },
              "image/jpeg",
              0.8
            );
          } catch (error) {
            console.error("Error capturing frame:", error);
          }
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start(500);
    } catch (error) {
      console.error("Error accessing webcam:", error);
      setIsStreaming(false);
    }
  };

  const handleStartMonitoring = (code, deviceId) => {
    setVerificationCode(code);
    setDeviceId(deviceId);
    setShowStartModal(false);
    startStreaming();
  };

  const handleStopStreaming = async (inputCode) => {
    try {
      if (inputCode !== verificationCode) {
        throw new Error("Invalid verification code");
      }

      if (!deviceId) {
        console.error("DeviceId is missing:", deviceId);
        throw new Error("Device ID is required");
      }

      await monitoringAPI.endMonitoring({
        deviceId: deviceId,
        code: inputCode,
      });

      cleanupMediaResources();
      setShowStopModal(false);
      return true;
    } catch (error) {
      console.error("Error stopping stream:", error);
      return false;
    }
  };

  useEffect(() => {
    return () => {
      if (isStreaming) {
        cleanupMediaResources();
      }
    };
  }, [isStreaming, cleanupMediaResources]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full rounded-lg"
      />

      <div className="absolute top-2 right-2">
        {isStreaming ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Live
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Offline
          </span>
        )}
      </div>

      {isStreaming && (
        <div className="mt-4">
          <button
            onClick={() => setShowStopModal(true)}
            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Stop Streaming
          </button>
        </div>
      )}

      {showStartModal && (
        <StartMonitoringModal
          onClose={() => setShowStartModal(false)}
          onStart={handleStartMonitoring}
        />
      )}

      {showStopModal && (
        <StopStreamingModal
          onClose={() => setShowStopModal(false)}
          onVerify={handleStopStreaming}
        />
      )}
    </div>
  );
};

export default Streaming;

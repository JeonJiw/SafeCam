import React, { useState, useEffect, useRef } from "react";

const Streaming = ({ socket }) => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const stopStreaming = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsStreaming(false);
  };

  useEffect(() => {
    if (!socket) return;

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
        };

        mediaRecorderRef.current = recorder;
        recorder.start(500);
      } catch (error) {
        console.error("Error accessing webcam:", error);
        setIsStreaming(false);
      }
    };

    startStreaming();
    return () => stopStreaming();
  }, [socket]);

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
    </div>
  );
};

export default Streaming;

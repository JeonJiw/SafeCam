import React, { useState, useEffect, useRef } from "react";

const Streaming = () => {
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    let mediaRecorder = null;

    const startStreaming = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        videoRef.current.srcObject = stream;
        setIsStreaming(true);

        const socket = new WebSocket("ws://localhost:3000");
        socketRef.current = socket;

        socket.onopen = () => {
          mediaRecorder = new MediaRecorder(stream, {
            mimeType: "video/webm; codecs=vp8",
          });
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
              socket.send(event.data);
            }
          };
          mediaRecorder.start(100);
        };

        socket.onmessage = (event) => {
          const blob = new Blob([event.data], { type: "video/webm" });
          const videoUrl = URL.createObjectURL(blob);
          videoRef.current.src = videoUrl;
        };

        socket.onerror = (error) => {
          console.error("WebSocket error:", error);
          setIsStreaming(false);
        };

        socket.onclose = () => {
          console.log("WebSocket closed");
          setIsStreaming(false);
        };
      } catch (error) {
        console.error("Error accessing webcam:", error);
        setIsStreaming(false);
      }
    };

    const stopStreaming = () => {
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
      setIsStreaming(false);
    };

    startStreaming();

    return () => {
      stopStreaming();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {" "}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="rounded-lg shadow-lg w-full max-w-2xl"
      />
      <div className="mt-4">
        {isStreaming ? (
          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            Streaming...
          </span>
        ) : (
          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
            Not Streaming
          </span>
        )}
      </div>
    </div>
  );
};

export default Streaming;

import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const Streaming = () => {
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null); // mediaRecorder를 useRef로 관리

  const [isStreaming, setIsStreaming] = useState(false);

  // stopStreaming을 useEffect 밖으로 옮기기
  const stopStreaming = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // 녹화 중지
    }
    if (socketRef.current) {
      socketRef.current.emit("streaming-finished"); // 서버에 종료 이벤트 전송
      socketRef.current.close(); // 소켓 연결 종료
    }
    if (videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop()); // 비디오 트랙 종료
    }
    setIsStreaming(false);
  };

  useEffect(() => {
    const startStreaming = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        videoRef.current.srcObject = stream;
        setIsStreaming(true);

        // Socket 연결
        const socket = io("http://localhost:3002");
        socketRef.current = socket;

        socket.on("connect", () => {
          console.log("Connected to the server");
        });

        socket.on("response", (message) => {
          console.log("Message from server:", message);
        });

        // MediaRecorder 설정
        const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });

        recorder.ondataavailable = (event) => {
          if (socketRef.current) {
            socketRef.current.emit("video-chunk", event.data); // 비디오 청크 전송
          }
        };

        recorder.onstop = () => {
          console.log("Recording stopped.");
        };

        mediaRecorderRef.current = recorder; // useRef에 mediaRecorder 저장
        recorder.start(100); // 100ms마다 비디오 청크 전송
      } catch (error) {
        console.error("Error accessing webcam:", error);
        setIsStreaming(false);
      }
    };

    startStreaming();

    return () => {
      stopStreaming(); // 컴포넌트 언마운트 시 스트리밍 종료
    };
  }, []); // 빈 배열로 처음 마운트될 때만 실행

  return (
    <div className="flex flex-col items-center justify-center h-full">
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
      {isStreaming && (
        <button
          onClick={stopStreaming} // 클릭 시 stopStreaming 호출
          className="mt-4 py-2 px-4 bg-red-600 text-white rounded-lg"
        >
          Stop Streaming
        </button>
      )}
    </div>
  );
};

export default Streaming;

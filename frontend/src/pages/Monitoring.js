import React from "react";
import Streaming from "../components/Camera/Streaming";

const Monitoring = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header with Title */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Monitoring</h1>
      </div>

      {/* Monitoring Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Streaming Video */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Live Stream</h2>
          <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
            <Streaming />
            <video
              src="placeholder.mp4"
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Object Detection Log */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Object Detection Log</h2>
          <ul className="divide-y divide-gray-200">
            {/* Replace with your object detection log component */}
            <li className="py-2">
              <span className="font-medium">Object Detected</span> at
              <span className="text-gray-500"> 10:25 AM</span>
            </li>
            <li className="py-2">
              <span className="font-medium">Motion Detected</span> at
              <span className="text-gray-500"> 10:20 AM</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Monitoring;

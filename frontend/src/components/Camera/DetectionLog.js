import React from "react";
import { AlertCircle } from "lucide-react";

const DetectionLog = ({ logs }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Detection Log</h2>
      {logs.length > 0 ? (
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-4 bg-gray-50 rounded-lg border-l-4 border-yellow-500"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium">Person Detected</span>
                </div>
                <time className="text-sm text-gray-500">
                  {formatTime(log.timestamp)}
                </time>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  Detected {log.detections.length} person(s) approaching
                </p>
                {log.detections.map((detection, idx) => (
                  <div key={idx} className="mt-1 text-sm">
                    <span className="text-gray-500">
                      Confidence: {Math.round(detection.confidence * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No detection events yet
        </div>
      )}
    </div>
  );
};

export default DetectionLog;

import React from "react";
import { X } from "lucide-react";

export const ActivityDetails = ({ activity, onClose }) => {
  console.log("as:", activity);

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const getLogTypeIcon = (type) => {
    switch (type) {
      case "monitoring_start":
        return "🟢";
      case "person_detected":
        return "👤";
      case "session_end":
        return "🔴";
      default:
        return "📝";
    }
  };

  const renderDetections = (detections) => {
    if (!detections || detections.length === 0) return null;

    return (
      <div className="ml-6 mt-2">
        {detections.map((detection, idx) => (
          <div key={idx} className="text-sm text-gray-600">
            <div>Confidence: {(detection.confidence * 100).toFixed(1)}%</div>
            <div className="text-xs text-gray-500">
              Position: {detection.boundingBox.x}, {detection.boundingBox.y}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Activity Details</h2>
            <p className="text-sm text-gray-600">
              {activity.device.deviceName} | {activity.device.location}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-8rem)]">
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-500">Last Updated</div>
              <div className="font-medium">
                {formatDate(activity.log.lastUpdated)}
              </div>
            </div>

            {/* Timeline of logs */}
            <div className="border-l-2 border-gray-200 ml-2 space-y-4">
              {activity.log.logs.map((log, index) => (
                <div key={index} className="ml-4 relative">
                  <span className="absolute -left-6 bg-white">
                    {getLogTypeIcon(log.type)}
                  </span>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="font-medium capitalize">
                        {log.type.replace("_", " ")}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(log.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

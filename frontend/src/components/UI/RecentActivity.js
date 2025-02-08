import React, { useState } from "react";
import { ActivityDetails } from "../../pages/ActivityDetails";

function RecentActivity({ activities }) {
  const [selectedActivity, setSelectedActivity] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
  };

  return (
    <div className="space-y-4">
      {activities?.map((activity) => (
        <div
          key={activity.id}
          onClick={() => handleActivityClick(activity)}
          className="flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
        >
          <div className="flex-1">
            <p className="font-medium">
              {activity.device.deviceName} | {activity.device.location}
            </p>
            <p className="text-sm text-gray-600">
              {formatDate(activity.log.lastUpdated)}
            </p>
          </div>
          <span className="text-blue-600">View Details →</span>
        </div>
      ))}

      {selectedActivity && (
        <ActivityDetails
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      )}
    </div>
  );
}

export default RecentActivity;

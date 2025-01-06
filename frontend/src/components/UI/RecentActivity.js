function RecentActivity({ activities }) {
  const handleActivityClick = (id) => {
    // handle click logic
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          onClick={() => handleActivityClick(activity.id)}
          className="flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
        >
          <div className="flex-1">
            <p className="font-medium">
              {activity.device.deviceName} | {activity.device.location}
            </p>
            <p className="text-sm text-gray-600">
              "{activity.activityType}" - {formatDate(activity.timestamp)}
            </p>
          </div>
          <span className="text-blue-600">View Details →</span>
        </div>
      ))}
    </div>
  );
}
export default RecentActivity;

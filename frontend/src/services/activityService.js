import { activityAPI } from "../api/activities";

export const activityService = {
  fetchRecentActivities: async () => {
    try {
      const response = await activityAPI.getMyActivities();
      return response.data;
    } catch (error) {
      console.error("Error fetching all devices:", error);
      throw error;
    }
  },
};

import { api } from "./index";
export const activityAPI = {
  // Admin
  getAllActivities: (params) => api.get("/activities", { params }),
  getOne: (activityId) => api.get(`/activities/${activityId}`),
  delete: (activityId) => api.delete(`/activities/${activityId}`),
  // User
  getMyActivities: () => api.get("/activities/myactivities"),
};

import { api } from "./index";
export const activityAPI = {
  getAll: () => api.get("/devices"),
};

import { api } from "./index";
export const deviceAPI = {
  getAllDevices: () => api.get("/devices"),
  getOne: (deviceId) => api.get(`/devices/${deviceId}`),
  getMyDevices: () => api.get("/devices/mydevices"),
  create: (data) => api.post("/devices", data),
  update: (deviceId, data) => api.put(`/devices/${deviceId}`, data),
  delete: (deviceId) => api.delete(`/devices/${deviceId}`),
};

import { api } from "./index";

export const monitoringAPI = {
  startMonitoring: (data) => api.post("/monitoring/start", data),
  logFailedAttempt: (formData) =>
    api.post("/monitoring/log-attempt", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  resetSession: () => api.post("/monitoring/reset-session"),
  endMonitoring: (data) => api.post("/monitoring/end", data),
  //getReport: () => api.get("/monitoring/report"),
};

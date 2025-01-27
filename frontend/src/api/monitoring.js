import { api } from "./index";

export const monitoringAPI = {
  startMonitoring: (code) => api.post("/monitoring/start", code),
  logFailedAttempt: (formData) =>
    api.post("/monitoring/log-attempt", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  endMonitoring: () => api.post("/monitoring/end"),
  //getReport: () => api.get("/monitoring/report"),
};

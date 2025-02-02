import { api } from "./index";

export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),

  initiateGoogleAuth: () => {
    window.location.href = `${api.defaults.baseURL}/auth/google`;
  },
};

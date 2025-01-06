import { api } from "./index";

export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),

  initiateGoogleAuth: () => {
    window.location.href = `${api.defaults.baseURL}/auth/google`;
  },

  handleGoogleCallback: async (searchString) => {
    try {
      const response = await api.get(`/auth/google/callback${searchString}`);

      return response;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
};

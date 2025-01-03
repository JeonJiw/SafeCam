import { authAPI } from "../api/auth";

export const authService = {
  signup: async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  logout: async () => {
    try {
      await authAPI.logout();
      localStorage.clear();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("access_token");
  },
};

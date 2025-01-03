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
      console.log("Login response:", response.data);
      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        console.log("Stored token:", localStorage.getItem("access_token"));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem("access_token");
  },
};

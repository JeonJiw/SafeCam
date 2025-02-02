import { authAPI } from "../api/auth";

export const authService = {
  signup: async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      console.log(123);
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error("This email is already registered");
      }
      throw new Error(error.response?.data?.message || "Failed to sign up");
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

const backendURL = "http://localhost:3002";
export const authService = {
  signup: async (createUserDto) => {
    try {
      const response = await fetch(`${backendURL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createUserDto),
      });
      return await response.json();
    } catch (error) {
      throw new Error("Signup failed");
    }
  },

  login: async (credentials) => {
    try {
      const response = await fetch(`${backendURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      return await response.json();
    } catch (error) {
      throw new Error("Login failed");
    }
  },
};

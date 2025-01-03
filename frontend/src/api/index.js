import axios from "axios";

const backendURL = "http://localhost:3002";

export const api = axios.create({
  baseURL: backendURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token"); // 또는 sessionStorage
    console.log("현재 토큰:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Request headers:", config.headers);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

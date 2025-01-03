import { deviceAPI } from "../api/devices";

export const deviceService = {
  fetchAllDevices: async () => {
    try {
      const response = await deviceAPI.getAllDevices();
      return response.data;
    } catch (error) {
      console.error("Error fetching all devices:", error);
      throw error;
    }
  },

  fetchDeviceDetails: async (deviceId) => {
    try {
      const response = await deviceAPI.getOne(deviceId);
      return response.data;
    } catch (error) {
      console.error("Error fetching device details:", error);
      throw error;
    }
  },

  fetchMyDevices: async () => {
    try {
      const response = await deviceAPI.getMyDevices();
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        // 토큰이 만료되었거나 유효하지 않은 경우
        localStorage.removeItem("access_token");
        // 로그인 페이지로 리다이렉트
        window.location.href = "/login";
      }
      throw error;
    }
  },

  createDevice: async (deviceData) => {
    try {
      const response = await deviceAPI.create(deviceData);
      // 추가적인 데이터 가공이나 로직 처리
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateDeviceStatus: async (deviceId, status) => {
    try {
      const response = await deviceAPI.update(deviceId, { status });
      // 상태 업데이트 후 추가 처리
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  DeleteDeviceStatus: async (deviceId) => {
    try {
      const response = await deviceAPI.delete(deviceId);
      // 상태 업데이트 후 추가 처리
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

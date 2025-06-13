// src/utils/axiosInstance.js (create this new file)
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Base URL for your API
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

// src/utils/axiosInstance.js (create this new file)
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://trackapply-api.onrender.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
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

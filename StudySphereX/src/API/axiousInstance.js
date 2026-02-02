import axios from "axios";
import { loaderStore } from "../lib/utils";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

axiosInstance.interceptors.request.use(
  (config) => {
    loaderStore.show();

    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    loaderStore.hide();
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    loaderStore.hide();
    return response;
  },
  (error) => {
    loaderStore.hide();
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
  
    if (
      error.response &&
      (error.response.status === 403 || error.response.status === 401)
    ) {
      
      if (
        error.response.data.message.includes("blocked") ||
        error.response.data.message.includes("suspended")
      ) {
        alert("Your account has been blocked.");
      }

 
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
export default axiosInstance;

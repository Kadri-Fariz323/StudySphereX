import axios from "axios";
import { loaderStore } from "../lib/utils";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
});

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

instance.interceptors.request.use(
  (config) => {
    loaderStore.show();
    return config;
  },
  (error) => {
    loaderStore.hide();
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    loaderStore.hide();
    return response;
  },
  (error) => {
    loaderStore.hide();
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (err) => Promise.reject(err)); 




export default axiosInstance;

import axios from "axios";

const API = axios.create({
  baseURL: "https://localhost:44377/api", // আপনার API URL
});

// Add Authorization header for all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Token পাঠানো হচ্ছে
  }
  return config;
});

export default API;

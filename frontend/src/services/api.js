import axios from "axios";
// API service that sets up an Axios instance with a base URL and interceptors 
// for handling JWT tokens and authentication errors.
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Add the JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle expired or invalid tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      alert("Your session has expired. Please log in again.");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;

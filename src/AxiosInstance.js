import axios from "axios";
import { useNavigate } from "react-router-dom";

// Create axios instance with configuration
const axiosInstance = axios.create({
  baseURL: "http://172.16.85.51:8000/api", // Your API base URL
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response, // return response if it's successful
  (error) => {
    // Check if the error is due to a 401 Unauthorized status (expired token)
    if (error.response && error.response.status === 401) {
      // Clear the stored token
      localStorage.removeItem("token");
      // Redirect the user to the login page
      window.location.href = "/login"; // Or use navigate('/login') if inside a React component
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

import axios from "axios";
import { backendConfig } from "../constants/config";

const backendOriginUrl = backendConfig.base;

const apiClient = axios.create({
  baseURL: backendOriginUrl + "/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization token from localStorage (authToken)
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Login API
export const loginUser = async (payload) => {
  try {
    const response = await apiClient.post("/login", payload);
    // console.log(response);
    return response.data;
  } catch (error) {
    console.error(error)
    throw error.response?.data || { message: "Login failed" };
  }
};

// Register API
export const registerUser = async (payload) => {
  try {
    const response = await apiClient.post("/register", payload);
    return response.data;
  } catch (error) {
    console.error(error)
    throw error.response?.data || { message: "Registration failed" };
  }
};

// Verify OTP API
export const verifyOtp = async (payload) => {
  try {
    const response = await apiClient.post("/verify-otp", payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "OTP verification failed" };
  }
};

// New: Resend OTP API
export const resendOtp = async (payload) => {
  try {
    const response = await apiClient.post("/resend-otp", payload);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response?.data || { message: "Failed to resend OTP" };
  }
};


// Logout API
export const logoutUser = async () => {
  try {
    const response = await apiClient.post("/logout");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Logout failed" };
  }
};

// ✅ Get User Profile API
export const getUserProfile = async (userId) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Token not found");

    // This endpoint now expects userId in the body, as per your initial request
    const response = await apiClient.post(
      "/profile",
      { userId }, // Sending userId in the request body
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch profile" };
  }
};

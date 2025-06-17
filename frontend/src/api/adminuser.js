// utils/api.js
import axios from 'axios';
import { backendConfig } from "../constants/config";

const backendOriginUrl = backendConfig.base;

const apiClient = axios.create({
  baseURL: backendOriginUrl + "/admin",
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

export const fetchUsers = async (params) => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Token not found");
    
        const response = await apiClient.get('/all-users', { params },{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }); 
          console.log("api calls",response) ;   
            return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error; // Re-throw to handle in the component
    }
};

/**
 * Fetches detailed information for a specific user.
 * @param {string} userId The ID of the user to fetch.
 * @returns {Promise<Object>} A promise that resolves to the user detail data.
 */
export const fetchUserDetailsById = async (userId) => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Token not found");
      // The endpoint matches your controller's expected route (e.g., /users/:id)
      const response = await apiClient.get(`/user/${userId}`,{
         headers: {
              Authorization: `Bearer ${token}`,
            }, 
        });
        console.log("user detail api",response.data)
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      // Re-throw the error to be caught by the component
      if (error.response) {
        throw new Error(error.response.data.message || 'An unknown server error occurred.');
      }
      throw new Error('An unknown error occurred while fetching user data.');
    }
  };
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


export const fetchAdminHome = async () => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Token not found");
    
        const response = await apiClient.get('/home',{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }); 
          console.log("api calls",response.data) ;   
            return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error; // Re-throw to handle in the component
    }
};
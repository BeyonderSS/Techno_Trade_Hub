import axios from "axios";
import { backendConfig } from "../constants/config";

const backendOriginUrl = backendConfig.base;

// Create an Axios instance with base URL and default headers
const apiClient = axios.create({
    baseURL: backendOriginUrl + "/user",
    headers: {
        "Content-Type": "application/json",
    },
});

// Axios interceptor to automatically attach Authorization token from localStorage
apiClient.interceptors.request.use((config) => {
    // Check if window is defined to ensure this runs in a browser environment
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("authToken");
        if (token) {
            // Attach the token to the Authorization header
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

/**
 * @description Fetches the user's home dashboard data from the backend.
 * The user ID is sent via the Authorization token, not in the request body.
 * @returns {Promise<object>} The data returned from the backend.
 * @throws {object} An error object if the API call fails.
 */
export const getUserHomeApi = async () => {
    try {
        // Retrieve the authentication token from local storage
        const token = localStorage.getItem("authToken");

        // If no token is found, throw an error immediately as authentication is required
        if (!token) {
            throw new Error("Authentication token not found. Please log in.");
        }

        // Make a GET request to the /home endpoint.
        // The `apiClient`'s interceptor already adds the Authorization header,
        // so explicitly adding it here again is redundant but harmless.
        const response = await apiClient.get("/home");

        // Return the data received from the backend
        return response.data;
    } catch (error) {
        // Log the error for debugging purposes
        console.error("Error fetching user home data:", error);

        // Propagate a more user-friendly error message, preferring backend error messages
        throw error.response?.data || { message: "Failed to fetch user home data. Please try again." };
    }
};

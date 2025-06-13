import axios from "axios";
import { backendConfig } from "../constants/config"; // Assuming backendConfig is available

const backendOriginUrl = backendConfig.base;

// Create an Axios instance specifically for reports, inheriting the base URL
const apiClient = axios.create({
    baseURL: backendOriginUrl + "/reports", // Base URL for all report endpoints
    headers: {
        "Content-Type": "application/json",
    },
});

// Axios interceptor to automatically attach Authorization token from localStorage
// This ensures every request made with `apiClient` includes the token if available.
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
}, (error) => {
    // Do something with request error
    return Promise.reject(error);
});

/**
 * @description Fetches the direct referral income report for a given user.
 * @param {string} userId - The ID of the user.
 * @param {object} [filters={}] - Optional filters like startDate, endDate, page, limit.
 * @returns {Promise<object>} The direct referral income report data.
 * @throws {Error} An error object if the API call fails.
 */
export const getReferralIncomeReportApi = async (userId, filters = {}) => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("Authentication token not found. Please log in.");
        }

        const response = await apiClient.post("/referral-income", { userId }, {
            params: filters // Pass query parameters (startDate, endDate, page, limit)
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching referral income report:", error);
        throw error.response?.data || { message: "Failed to fetch referral income report." };
    }
};

/**
 * @description Fetches the monthly salary income report for a given user.
 * @param {string} userId - The ID of the user.
 * @param {object} [filters={}] - Optional filters like startDate, endDate, page, limit.
 * @returns {Promise<object>} The monthly salary income report data.
 * @throws {Error} An error object if the API call fails.
 */
export const getSalaryIncomeReportApi = async (userId, filters = {}) => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("Authentication token not found. Please log in.");
        }

        const response = await apiClient.post("/salary-income", { userId }, {
            params: filters // Pass query parameters (startDate, endDate, page, limit)
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching salary income report:", error);
        throw error.response?.data || { message: "Failed to fetch monthly salary income report." };
    }
};

/**
 * @description Fetches the team performance report for a given user's downline.
 * @param {string} userId - The ID of the root user.
 * @param {object} [filters={}] - Optional filters like page, limit, memberSearch.
 * @returns {Promise<object>} The team performance report data.
 * @throws {Error} An error object if the API call fails.
 */
export const getTeamPerformanceReportApi = async (userId, filters = {}) => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("Authentication token not found. Please log in.");
        }

        const response = await apiClient.post("/team-performance", { userId }, {
            params: filters // Pass query parameters (page, limit, memberSearch)
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching team performance report:", error);
        throw error.response?.data || { message: "Failed to fetch team performance report." };
    }
};

/**
 * @description Fetches the level income report for a given user.
 * @param {string} userId - The ID of the user.
 * @param {object} [filters={}] - Optional filters like startDate, endDate, page, limit.
 * @returns {Promise<object>} The level income report data.
 * @throws {Error} An error object if the API call fails.
 */
export const getLevelIncomeReportApi = async (userId, filters = {}) => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("Authentication token not found. Please log in.");
        }

        const response = await apiClient.post("/level-income", { userId }, {
            params: filters // Pass query parameters (startDate, endDate, page, limit)
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching level income report:", error);
        throw error.response?.data || { message: "Failed to fetch level income report." };
    }
};

/**
 * @description Fetches the weekly bonus report for a given user.
 * @param {string} userId - The ID of the user.
 * @param {object} [filters={}] - Optional filters like startDate, endDate, page, limit.
 * @returns {Promise<object>} The weekly bonus report data.
 * @throws {Error} An error object if the API call fails.
 */
export const getWeeklyBonusReportApi = async (userId, filters = {}) => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("Authentication token not found. Please log in.");
        }

        const response = await apiClient.post("/weekly-bonus", { userId }, {
            params: filters // Pass query parameters (startDate, endDate, page, limit)
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching weekly bonus report:", error);
        throw error.response?.data || { message: "Failed to fetch weekly bonus report." };
    }
};

/**
 * @description Fetches the trade history (ROI payout) report for a given user.
 * @param {string} userId - The ID of the user.
 * @param {object} [filters={}] - Optional filters like startDate, endDate, page, limit.
 * @returns {Promise<object>} The trade history report data.
 * @throws {Error} An error object if the API call fails.
 */
export const getTradeHistoryReportApi = async (userId, filters = {}) => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("Authentication token not found. Please log in.");
        }

        const response = await apiClient.post("/trade-history", { userId }, {
            params: filters // Pass query parameters (startDate, endDate, page, limit)
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching trade history report:", error);
        throw error.response?.data || { message: "Failed to fetch trade history report." };
    }
};

import axios from "axios";
import { backendConfig } from "../constants/config"; // Assuming backendConfig is available

const backendOriginUrl = backendConfig.base;

// Create an Axios instance specifically for investment and withdrawal related endpoints
const apiClient = axios.create({
    baseURL: backendOriginUrl + "/investments", // Base URL for all investment endpoints
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
 * @description Fetches all completed withdrawal transactions.
 * Optionally filters by user ID and date range, and supports pagination.
 * @param {object} [filters={}] - Optional filters: `userId`, `startDate`, `endDate`, `page`, `limit`.
 * @returns {Promise<object>} A response object containing withdrawal data and pagination info.
 * @throws {Error} An error object if the API call fails.
 */
export const getAllWithdrawalsApi = async (filters = {}) => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("Authentication token not found. Please log in.");
        }

        const response = await apiClient.get("/withdrawals", {
            params: filters // Pass filters as query parameters
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching all withdrawals:", error);
        throw error.response?.data || { message: "Failed to fetch all withdrawals." };
    }
};

/**
 * @description Creates a new investment for a user.
 * The ROI percentages (`roiPercentageMin`, `roiPercentageMax`) are determined by the backend based on the `amount`.
 * A 5% direct referral bonus is distributed to the user's referrer.
 * @param {string} userId - The ID of the user making the investment.
 * @param {number} amount - The investment amount.
 * @returns {Promise<object>} A response object containing the new investment, deposit transaction, and referral bonus details.
 * @throws {Error} An error object if the API call fails (e.g., user not found, invalid amount).
 */
export const createInvestmentApi = async (userId, amount) => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("Authentication token not found. Please log in.");
        }

        const response = await apiClient.post("/create", { userId, amount });
        return response.data;
    } catch (error) {
        console.error("Error creating investment:", error);
        throw error.response?.data || { message: "Failed to create investment." };
    }
};

/**
 * @description Allows a user to raise a new withdrawal request.
 * The requested amount is immediately deducted from the user's wallet balance
 * and the transaction status is set to 'pending'.
 * @param {string} userId - The ID of the user requesting the withdrawal.
 * @param {number} amount - The amount to be withdrawn.
 * @param {string} cryptoWalletAddress - The crypto wallet address for the withdrawal.
 * @returns {Promise<object>} A response object containing the withdrawal request details and updated wallet balance.
 * @throws {Error} An error object if the API call fails (e.g., insufficient balance, invalid inputs).
 */
export const raiseWithdrawalRequestApi = async (userId, amount, cryptoWalletAddress) => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("Authentication token not found. Please log in.");
        }

        const response = await apiClient.post("/request-withdrawal", { userId, amount, cryptoWalletAddress });
        return response.data;
    } catch (error) {
        console.error("Error raising withdrawal request:", error);
        throw error.response?.data || { message: "Failed to raise withdrawal request." };
    }
};

/**
 * @description Fetches the complete withdrawal history for a specific user,
 * including transactions with 'pending', 'completed', and 'failed' statuses.
 * Supports date range filtering and pagination.
 * @param {string} userId - The ID of the user whose withdrawal history is being fetched.
 * @param {object} [filters={}] - Optional filters: `startDate`, `endDate`, `page`, `limit`.
 * @returns {Promise<object>} A response object containing the withdrawal history data and pagination info.
 * @throws {Error} An error object if the API call fails.
 */
export const getWithdrawalHistoryApi = async (userId, filters = {}) => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("Authentication token not found. Please log in.");
        }

        const response = await apiClient.get("/history", {
            params: { ...filters, userId } // userId is a required query parameter for this endpoint
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching withdrawal history:", error);
        throw error.response?.data || { message: "Failed to fetch withdrawal history." };
    }
};

/**
 * @description Fetches all pending withdrawal requests, typically for administrative review.
 * Supports date range filtering and pagination.
 * @param {object} [filters={}] - Optional filters: `startDate`, `endDate`, `page`, `limit`.
 * @returns {Promise<object>} A response object containing pending withdrawal requests and pagination info.
 * @throws {Error} An error object if the API call fails.
 */
export const getAllPendingWithdrawalRequestsApi = async (filters = {}) => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("Authentication token not found. Please log in.");
        }

        const response = await apiClient.get("/pending-requests", {
            params: filters // Pass filters as query parameters
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching pending withdrawal requests:", error);
        throw error.response?.data || { message: "Failed to fetch pending withdrawal requests." };
    }
};

/**
 * @description Approves a pending withdrawal request by its transaction ID.
 * The transaction status is updated to 'completed'. The amount is NOT credited back
 * to the user's wallet as it was already deducted upon request.
 * @param {string} transactionId - The ID of the withdrawal transaction to approve.
 * @param {string} [adminNotes] - Optional notes from the administrator regarding the approval.
 * @returns {Promise<object>} A response object containing the approved transaction details.
 * @throws {Error} An error object if the API call fails (e.g., transaction not found, not pending).
 */
export const approveWithdrawalRequestApi = async (transactionId, adminNotes) => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("Authentication token not found. Please log in.");
        }

        const response = await apiClient.post("/approve-withdrawal", { transactionId, adminNotes });
        return response.data;
    } catch (error) {
        console.error("Error approving withdrawal request:", error);
        throw error.response?.data || { message: "Failed to approve withdrawal request." };
    }
};

/**
 * @description Rejects a pending withdrawal request by its transaction ID.
 * The transaction status is updated to 'failed', and the withdrawn amount is
 * credited back to the user's wallet balance.
 * @param {string} transactionId - The ID of the withdrawal transaction to reject.
 * @param {string} [adminNotes] - Optional notes from the administrator regarding the rejection.
 * @returns {Promise<object>} A response object containing the rejected transaction details and updated wallet balance.
 * @throws {Error} An error object if the API call fails (e.g., transaction not found, not pending).
 */
export const rejectWithdrawalRequestApi = async (transactionId, adminNotes) => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("Authentication token not found. Please log in.");
        }

        const response = await apiClient.post("/reject-withdrawal", { transactionId, adminNotes });
        return response.data;
    } catch (error) {
        console.error("Error rejecting withdrawal request:", error);
        throw error.response?.data || { message: "Failed to reject withdrawal request." };
    }
};

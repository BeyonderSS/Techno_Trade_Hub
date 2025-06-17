import axios from 'axios';
import { backendConfig } from "../constants/config";

const backendOriginUrl = backendConfig.base;

const apiClient = axios.create({
  baseURL: backendOriginUrl + "/admin-reports",
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

/**
 * Fetches the admin referral bonus distribution report.
 * @param {object} params - The query parameters for the report.
 * @param {number} params.page - The page number for pagination.
 * @param {number} params.limit - The number of items per page.
 * @param {string} [params.searchUser] - The search term for user name or email.
 * @param {string} [params.startDate] - The start date for filtering (e.g., 'YYYY-MM-DD').
 * @param {string} [params.endDate] - The end date for filtering (e.g., 'YYYY-MM-DD').
 * @returns {Promise<object>} The API response containing data and pagination.
 */
export const getAdminReferralBonusDistributionReportApi = async (params) => {
    try {
      const response = await apiClient.get('/referral-bonus', { params });
      // The backend already wraps the response, so we just return it.
      // Assuming your backend sends back { success, data, pagination }
      console.log(response,"api referral bonus admin");
      return response.data;
    } catch (error) {
      // Rethrow to be caught by the component's try-catch block
      throw error.response?.data || new Error('An unknown API error occurred.');
    }
  };


  /**
 * Fetches the admin weekly bonus distribution report from the backend.
 * @param {object} filters - The filters to apply to the report.
 * @param {number} filters.page - The current page number.
 * @param {number} filters.limit - The number of items per page.
 * @param {string} [filters.startDate] - The start date in YYYY-MM-DD format.
 * @param {string} [filters.endDate] - The end date in YYYY-MM-DD format.
 * @param {string} [filters.searchUser] - The search term for user name or email.
 * @returns {Promise<object>} The API response data containing transactions and pagination info.
 */
export const getAdminWeeklyBonusReportApi = async (filters) => {
    try {
        // The endpoint should match your backend route definition
        const response = await apiClient.get('/weekly-bonus', { 
            params: filters 
        });
        return response.data; // The backend returns { success, data, pagination }
    } catch (error) {
        // Log and re-throw the error for the component to handle
        console.error('Error fetching admin weekly bonus report:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to fetch report');
    }
};

 /**
 * Fetches the admin weekly bonus distribution report from the backend.
 * @param {object} filters - The filters to apply to the report.
 * @param {number} filters.page - The current page number.
 * @param {number} filters.limit - The number of items per page.
 * @param {string} [filters.startDate] - The start date in YYYY-MM-DD format.
 * @param {string} [filters.endDate] - The end date in YYYY-MM-DD format.
 * @param {string} [filters.searchUser] - The search term for user name or email.
 * @returns {Promise<object>} The API response data containing transactions and pagination info.
 */
 export const getAdminMonthlySalaryReport = async (filters) => {
    try {
        // The endpoint should match your backend route definition
        const response = await apiClient.get('/monthly-salary', { 
            params: filters 
        });
        return response.data; // The backend returns { success, data, pagination }
    } catch (error) {
        // Log and re-throw the error for the component to handle
        console.error('Error fetching admin weekly bonus report:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to fetch report');
    }
};

export const getTopPerformingTeamsReport = async (filters) => {
    try {
        // The endpoint should match your backend route definition for this report
        // Example: If your backend route is /api/admin/reports/top-teams
        const response = await apiClient.get('/team-performance', {
            params: filters
        });
        // The backend returns { success, reportMeta, data, pagination }
        console.log(response,"response api top team");
        return response.data;
    } catch (error) {
        console.error('Error fetching top performing teams report:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to fetch top performing teams report');
    }
};
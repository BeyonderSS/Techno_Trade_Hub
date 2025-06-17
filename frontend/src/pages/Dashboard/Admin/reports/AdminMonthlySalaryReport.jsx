import { useState, useEffect, useCallback } from "react";
import axios from "axios";
// Assuming this path is correct for your API utility
import { getAdminMonthlySalaryReport } from "../../../../api/adminreports";

const AdminMonthlySalaryReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "transactionDate", direction: "descending" }); // Default sort by date

  const fetchSalaryReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (searchTerm) {
        params.searchUser = searchTerm;
      }
      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }

      // Backend handles sorting by transactionDate implicitly with -1,
      // For now, sorting logic for other fields remains primarily on frontend for flexibility.
      // If you need backend sorting for 'name', 'email', 'amount', 'type', 'status', 'txnId',
      // you would need to extend your backend controller to accept a 'sortBy' and 'sortDirection' parameter.

      // Fix: Pass `params` directly to the API function
      const response = await getAdminMonthlySalaryReport(params);

      setData(response.data); // Backend returns data directly under 'data' property
      setPagination(response.pagination); // Backend returns pagination directly under 'pagination' property
    } catch (err) {
      console.error("Error fetching admin monthly salary distribution report:", err);
      // Ensure error handling gracefully extracts messages
      setError(err.message || "Failed to fetch salary reports.");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm, startDate, endDate]);

  useEffect(() => {
    fetchSalaryReports();
  }, [fetchSalaryReports]);

  // Sorting logic (client-side for now, as backend only sorts by transactionDate by default)
  const sortedData = [...data].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = sortConfig.key.includes('.')
        ? sortConfig.key.split('.').reduce((o, i) => o?.[i], a)
        : a[sortConfig.key];
      const bValue = sortConfig.key.includes('.')
        ? sortConfig.key.split('.').reduce((o, i) => o?.[i], b)
        : b[sortConfig.key];

      // Handle numerical sort for amount
      let valA = aValue;
      let valB = bValue;

      if (sortConfig.key === 'amount') {
        valA = Number(aValue);
        valB = Number(bValue);
      } else if (sortConfig.key === 'userId.name' || sortConfig.key === 'userId.email') {
        // For string comparisons on nested objects (name/email)
        valA = String(aValue || '').toLowerCase();
        valB = String(bValue || '').toLowerCase();
      } else if (sortConfig.key === 'transactionDate') {
        valA = new Date(aValue).getTime();
        valB = new Date(bValue).getTime();
      }

      if (valA < valB) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (valA > valB) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
    }
    return 0;
  });

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleRowsPerPageChange = (e) => {
    setPagination((prev) => ({ ...prev, limit: Number(e.target.value), page: 1 })); // Reset to first page
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    }
    return '';
  };

  const dateTimeTemplate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="p-4 sm:p-6 bg-black/50 min-h-screen text-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-white">Monthly Salary Report</h2>

      <div className="bg-black/50 rounded-lg shadow-md p-4 border border-white/10 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <input
            type="text"
            placeholder="Search by user (name or email)..."
            className="w-full sm:w-1/3 p-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Start Date"
            />
            <span className="text-gray-300">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="End Date"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="rowsPerPage" className="text-gray-300">Rows per page:</label>
            <select
              id="rowsPerPage"
              value={pagination.limit}
              onChange={handleRowsPerPageChange}
              className="p-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[5, 10, 25, 50].map((rows) => (
                <option key={rows} value={rows}>
                  {rows}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400">Loading salary reports...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-sm border border-white/10">
            <table className="min-w-full leading-normal">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('id')}> {/* S.No will be based on client-side index */}
                    S.No
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('userId.name')}>
                    Username {getSortIndicator('userId.name')}
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('userId.email')}>
                    Email {getSortIndicator('userId.email')}
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('amount')}>
                    Amount {getSortIndicator('amount')}
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('type')}>
                    Type {getSortIndicator('type')}
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('status')}>
                    Status {getSortIndicator('status')}
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('txnId')}>
                    Transaction ID {getSortIndicator('txnId')}
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('transactionDate')}>
                    Transaction Date {getSortIndicator('transactionDate')}
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Admin Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 text-gray-200">
                {sortedData.length > 0 ? (
                  sortedData.map((row, index) => (
                    <tr key={row._id} className="hover:bg-gray-700 transition-colors duration-200">
                      <td className="px-5 py-3 border-b border-gray-700 text-sm">
                        {(pagination.page - 1) * pagination.limit + index + 1}
                      </td>
                      <td className="px-5 py-3 border-b border-gray-700 text-sm">
                        {row.userId?.name || "N/A"}
                      </td>
                      <td className="px-5 py-3 border-b border-gray-700 text-sm">
                        {row.userId?.email || "N/A"}
                      </td>
                      <td className="px-5 py-3 border-b border-gray-700 text-sm">
                        ${row.amount?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-5 py-3 border-b border-gray-700 text-sm">
                        {row.type || "N/A"}
                      </td>
                      <td className="px-5 py-3 border-b border-gray-700 text-sm">
                        {row.status || "N/A"}
                      </td>
                      <td className="px-5 py-3 border-b border-gray-700 text-sm">
                        {row.txnId || "N/A"}
                      </td>
                      <td className="px-5 py-3 border-b border-gray-700 text-sm">
                        {dateTimeTemplate(row.transactionDate)}
                      </td>
                      <td className="px-5 py-3 border-b border-gray-700 text-sm">
                        {row.adminActionNotes || "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-5 py-5 text-center text-sm text-gray-400">
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-300">
            Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Previous
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-md ${
                  pagination.page === page
                    ? "bg-blue-800 text-white"
                    : "bg-gray-700 text-gray-200 hover:bg-blue-600 hover:text-white"
                } transition-colors duration-200`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMonthlySalaryReport;
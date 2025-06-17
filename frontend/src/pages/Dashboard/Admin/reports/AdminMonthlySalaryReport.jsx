import { useState, useEffect } from "react";

const AdminMonthlySalaryReport = () => {
  // Hardcoded dummy data for Monthly Salary Reports
  const dummyMonthlySalaryData = [
    {
      id: 1,
      userId: { username: "salaryUser01" },
      amount: 150.00, // Monthly salary amount
      rewardTier: "Tier 1", // Example: Bronze, Silver, Gold, or number of contributors
      creditedOn: "2023-11-01T08:00:00Z",
    },
    {
      id: 2,
      userId: { username: "salaryUser02" },
      amount: 250.00,
      rewardTier: "Tier 2",
      creditedOn: "2023-11-01T09:00:00Z",
    },
    {
      id: 3,
      userId: { username: "salaryUser03" },
      amount: 150.00,
      rewardTier: "Tier 1",
      creditedOn: "2023-12-01T08:30:00Z",
    },
    {
      id: 4,
      userId: { username: "salaryUser04" },
      amount: 350.00,
      rewardTier: "Tier 3",
      creditedOn: "2023-12-01T09:30:00Z",
    },
    {
      id: 5,
      userId: { username: "salaryUser05" },
      amount: 250.00,
      rewardTier: "Tier 2",
      creditedOn: "2024-01-01T10:00:00Z",
    },
    {
      id: 6,
      userId: { username: "salaryUser01" },
      amount: 150.00,
      rewardTier: "Tier 1",
      creditedOn: "2024-01-01T10:15:00Z",
    },
    {
      id: 7,
      userId: { username: "salaryUser03" },
      amount: 150.00,
      rewardTier: "Tier 1",
      creditedOn: "2024-02-01T08:45:00Z",
    },
    {
      id: 8,
      userId: { username: "salaryUser06" },
      amount: 450.00,
      rewardTier: "Tier 4",
      creditedOn: "2024-02-01T11:00:00Z",
    },
    {
      id: 9,
      userId: { username: "salaryUser04" },
      amount: 350.00,
      rewardTier: "Tier 3",
      creditedOn: "2024-03-01T09:15:00Z",
    },
    {
      id: 10,
      userId: { username: "salaryUser05" },
      amount: 250.00,
      rewardTier: "Tier 2",
      creditedOn: "2024-03-01T10:30:00Z",
    },
    {
      id: 11,
      userId: { username: "salaryUser07" },
      amount: 550.00,
      rewardTier: "Tier 5",
      creditedOn: "2024-04-01T12:00:00Z",
    },
    {
      id: 12,
      userId: { username: "salaryUser02" },
      amount: 250.00,
      rewardTier: "Tier 2",
      creditedOn: "2024-04-01T12:30:00Z",
    },
  ];

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  useEffect(() => {
    // Simulate API call delay with setTimeout
    setTimeout(() => {
      setData(dummyMonthlySalaryData);
    }, 500);
  }, []);

  // Filtering logic
  const filteredData = data.filter((row) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (row.userId?.username && row.userId.username.toLowerCase().includes(searchLower)) ||
      (row.amount && row.amount.toString().includes(searchLower)) ||
      (row.rewardTier && row.rewardTier.toLowerCase().includes(searchLower)) ||
      (row.creditedOn && new Date(row.creditedOn).toLocaleDateString().toLowerCase().includes(searchLower))
    );
  });

  // Sorting logic
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = sortConfig.key.includes('.')
        ? sortConfig.key.split('.').reduce((o, i) => o?.[i], a)
        : a[sortConfig.key];
      const bValue = sortConfig.key.includes('.')
        ? sortConfig.key.split('.').reduce((o, i) => o?.[i], b)
        : b[sortConfig.key];

      // Handle numerical sort for amount and rewardTier if they are numbers
      let valA = aValue;
      let valB = bValue;
      if (sortConfig.key === 'amount' || sortConfig.key === 'rewardTier') {
        valA = Number(aValue);
        valB = Number(bValue);
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

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
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
            placeholder="Search..."
            className="w-full sm:w-1/3 p-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <label htmlFor="rowsPerPage" className="text-gray-300">Rows per page:</label>
            <select
              id="rowsPerPage"
              value={rowsPerPage}
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

        <div className="overflow-x-auto rounded-lg shadow-sm border border-white/10">
          <table className="min-w-full leading-normal">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('id')}>
                  S.No {getSortIndicator('id')}
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('userId.username')}>
                  Username {getSortIndicator('userId.username')}
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('amount')}>
                  Amount {getSortIndicator('amount')}
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('rewardTier')}>
                  Reward Tier {getSortIndicator('rewardTier')}
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-600 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('creditedOn')}>
                  Credited On {getSortIndicator('creditedOn')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 text-gray-200">
              {currentData.length > 0 ? (
                currentData.map((row, index) => (
                  <tr key={row.id} className="hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-5 py-3 border-b border-gray-700 text-sm">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-5 py-3 border-b border-gray-700 text-sm">
                      {row.userId?.username || "N/A"}
                    </td>
                    <td className="px-5 py-3 border-b border-gray-700 text-sm">
                      ${row.amount?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-5 py-3 border-b border-gray-700 text-sm">
                      {row.rewardTier || "N/A"}
                    </td>
                    <td className="px-5 py-3 border-b border-gray-700 text-sm">
                      {dateTimeTemplate(row.creditedOn)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-5 py-5 text-center text-sm text-gray-400">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-300">
            Showing {startIndex + 1} to {Math.min(endIndex, sortedData.length)} of {sortedData.length} entries
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === page
                    ? "bg-blue-800 text-white"
                    : "bg-gray-700 text-gray-200 hover:bg-blue-600 hover:text-white"
                } transition-colors duration-200`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
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
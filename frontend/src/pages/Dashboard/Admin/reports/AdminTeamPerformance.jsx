"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { DataTable } from "@/components/ui/data-table"; // Adjust path if needed
import ReportHeader from "@/components/report-header"; // Adjust path if needed
import { Users, Wallet, TrendingUp, DollarSign } from "lucide-react";
import { getTopPerformingTeamsReport } from "../../../../api/adminreports";

export default function AdminTeamPerformancePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [timeframe, setTimeframe] = useState("monthly"); // 'weekly' or 'monthly'
  const [sortBy, setSortBy] = useState("total_investment"); // 'total_investment' or 'new_members'

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const filters = {
        timeframe,
        sortBy,
        page: pagination.page,
        limit: pagination.limit,
      };

      const apiResponse = await getTopPerformingTeamsReport(filters); // Renamed to apiResponse for clarity

      // Safely access data and pagination from the API response
      // The backend response is { success, message, data, pagination, reportMeta }
      // So, apiResponse.data will contain the array of team reports.
      // And apiResponse.pagination will contain the pagination object.
      setData(apiResponse.data || []); // Ensure 'data' is always an array
      setPagination(apiResponse.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 }); // Provide a default pagination object

    } catch (err) {
      console.error("Error fetching top performing teams report:", err);
      // Ensure error message is extracted correctly
      setError(err.message || err.response?.data?.message || "Failed to load top performing teams report.");
    } finally {
      setLoading(false);
    }
  }, [timeframe, sortBy, pagination.page, pagination.limit]);

  // Effect to trigger data fetching when filters or pagination change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle pagination changes
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleRowsPerPageChange = (e) => {
    setPagination((prev) => ({ ...prev, limit: Number(e.target.value), page: 1 }));
  };

  // Column definitions for the DataTable, memoized for performance
  const columns = useMemo(() => [
    {
      accessorKey: "teamLeader.name",
      header: "Team Leader",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.teamLeader?.name || 'N/A'}</div>
          <div className="text-sm text-muted-foreground">{row.original.teamLeader?.email || 'N/A'}</div>
        </div>
      ),
    },
    {
      accessorKey: "teamSize",
      header: "Team Size",
      cell: ({ row }) => (
        <div className="text-right font-medium">{row.original.teamSize || 0} members</div>
      ),
    },
    {
      accessorKey: "totalTeamInvestment",
      header: "Total Team Investment",
      cell: ({ row }) => (
        <div className="text-right font-medium">${row.original.totalTeamInvestment?.toFixed(2) || "0.00"}</div>
      ),
    },
    {
      accessorKey: `${timeframe}Performance.value`, // Dynamically access based on timeframe
      header: `${timeframe === 'weekly' ? 'Weekly' : 'Monthly'} Performance (${sortBy === 'total_investment' ? 'Investment' : 'New Members'})`,
      cell: ({ row }) => {
        const performance = row.original[`${timeframe}Performance`];
        if (!performance) return "N/A";

        const value = performance.value || 0;
        const isInvestment = sortBy === 'total_investment';
        const formattedValue = isInvestment ? `$${value.toFixed(2)}` : value;

        let color = "text-gray-400";
        if (value > 0) {
            color = isInvestment ? (value > 1000 ? "text-green-500" : "text-amber-500") : (value >= 5 ? "text-green-500" : "text-amber-500");
        }

        return <div className={`font-medium ${color}`}>{formattedValue}</div>;
      },
    },
  ], [timeframe, sortBy]);

  const overallStats = useMemo(() => {
    // Ensure pagination.total is available before using it
    const totalTeamLeaders = pagination.total !== undefined ? pagination.total : 0;
    const totalMembersDisplayed = data.reduce((sum, team) => sum + (team.teamSize || 0), 0);
    const totalInvestmentDisplayed = data.reduce((sum, team) => sum + (team.totalTeamInvestment || 0), 0);
    const totalPerformanceValueDisplayed = data.reduce((sum, team) => sum + (team[`${timeframe}Performance`]?.value || 0), 0);

    return [
      {
        label: "Total Teams Identified",
        value: totalTeamLeaders.toString(),
        icon: <Users className="h-5 w-5" />,
      },
      {
        label: "Total Team Members (Displayed)",
        value: totalMembersDisplayed.toString(),
        icon: <Users className="h-5 w-5" />,
      },
      {
        label: "Total Investment (Displayed)",
        value: `$${totalInvestmentDisplayed.toFixed(2)}`,
        icon: <DollarSign className="h-5 w-5" />,
      },
      {
        label: `${timeframe === 'weekly' ? 'Weekly' : 'Monthly'} Performance Sum (Displayed)`,
        value: sortBy === 'total_investment' ? `$${totalPerformanceValueDisplayed.toFixed(2)}` : totalPerformanceValueDisplayed.toString(),
        icon: <TrendingUp className="h-5 w-5" />,
      },
    ];
  }, [data, pagination.total, timeframe, sortBy]); // Added pagination.total to dependencies

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-10 max-w-7xl mx-auto flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="text-white text-lg">Loading top performing teams report...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-10 max-w-7xl mx-auto flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <ReportHeader
        title="Top Performing Teams Report"
        description="View and analyze the performance of top teams based on various metrics."
        stats={overallStats}
      />

      <div className="bg-black/50 rounded-lg shadow-md p-4 border border-white/10 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          {/* Timeframe Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="timeframe" className="text-gray-300">Timeframe:</label>
            <select
              id="timeframe"
              value={timeframe}
              onChange={(e) => { setTimeframe(e.target.value); setPagination(prev => ({...prev, page: 1})); }}
              className="p-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="sortBy" className="text-gray-300">Sort By:</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPagination(prev => ({...prev, page: 1})); }}
              className="p-2 rounded-md bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="total_investment">Total Investment</option>
              <option value="new_members">New Members</option>
            </select>
          </div>

          {/* Rows per page */}
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

        {data.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            No top performing teams found for the selected criteria.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-sm border border-white/10">
            <DataTable columns={columns} data={data} />
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
            {/* Render page buttons only if totalPages is calculated */}
            {pagination.totalPages > 0 && Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
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
              disabled={pagination.page === pagination.totalPages || pagination.totalPages === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
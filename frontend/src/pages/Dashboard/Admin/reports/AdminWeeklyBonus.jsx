"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { DataTable } from "@/components/ui/data-table";
import ReportHeader from "@/components/report-header";
import { Badge } from "@/components/ui/badge"; // Corrected path
import { Input } from "@/components/ui/input"; // For the search bar
import { Button } from "@/components/ui/button"; // For pagination and export
import { DollarSign, Calendar, Download, Search } from "lucide-react";
import { getAdminWeeklyBonusReportApi } from "../../../../api/adminreports"; // Use the new API function
import { useSession } from "../../../../context/SessionContext";

// A simple debounce hook to delay API calls while typing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};


export default function AdminWeeklyBonusPage() {
  const { user, loading: sessionLoading } = useSession();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);

  // State for filters
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // 500ms delay

  // State for pagination, matching backend response
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const fetchData = useCallback(async () => {
    if (sessionLoading) return; // Wait for session to load
    if (!user) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const filters = {
        page: pagination.page,
        limit: pagination.limit,
        startDate: startDateFilter || undefined,
        endDate: endDateFilter || undefined,
        searchUser: debouncedSearchQuery || undefined,
      };
      
      const response = await getAdminWeeklyBonusReportApi(filters);
      setData(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error("Error fetching weekly bonus report:", err);
      setError(err.message || "Failed to load weekly bonus report.");
    } finally {
      setLoading(false);
    }
  }, [
    sessionLoading,
    user,
    pagination.page,
    pagination.limit,
    startDateFilter,
    endDateFilter,
    debouncedSearchQuery,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [startDateFilter, endDateFilter, debouncedSearchQuery]);

  // Column definitions for the DataTable
  const columns = useMemo(() => [
     {
      accessorKey: "txnId",
      header: "Transaction ID",
    },
    {
      accessorKey: "userId.name",
      header: "User",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.userId?.name || 'N/A'}</div>
          <div className="text-sm text-muted-foreground">{row.original.userId?.email || 'N/A'}</div>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="font-medium text-right">${row.original.amount?.toFixed(2) || "0.00"}</div>
      ),
    },
    {
      accessorKey: "transactionDate",
      header: "Date",
      cell: ({ row }) => <div>{new Date(row.original.transactionDate).toLocaleDateString()}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "completed" ? "success" : "default"}>
          {row.original.status}
        </Badge>
      ),
    },
  ], []);

  // Stats for the header
  const stats = [
    {
      label: "Total Transactions",
      value: pagination.total,
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      label: "Showing Page",
      value: `${pagination.page} of ${pagination.totalPages}`,
      icon: <Calendar className="h-5 w-5" />,
    },
  ];

  const handleExportCsv = async () => {
    if (pagination.total === 0) {
      alert("No data to export.");
      return;
    }
    setIsExporting(true);
    try {
      // Fetch all data for the current filters without pagination
      const response = await getAdminWeeklyBonusReportApi({
        startDate: startDateFilter || undefined,
        endDate: endDateFilter || undefined,
        searchUser: debouncedSearchQuery || undefined,
        page: 1,
        limit: pagination.total, // Fetch all records
      });
      const allData = response.data;
      
      const csvHeader = ["Transaction ID", "User Name", "User Email", "Amount", "Date", "Status"];
      const csvRows = allData.map(row => {
        const escapeCsvField = (field) => {
          const strField = String(field ?? '');
          if (strField.includes(',') || strField.includes('"') || strField.includes('\n')) {
            return `"${strField.replace(/"/g, '""')}"`;
          }
          return strField;
        };

        return [
          escapeCsvField(row.txnId),
          escapeCsvField(row.userId?.name),
          escapeCsvField(row.userId?.email),
          escapeCsvField(row.amount?.toFixed(2)),
          escapeCsvField(new Date(row.transactionDate).toLocaleDateString()),
          escapeCsvField(row.status),
        ].join(',');
      });

      const csvContent = [csvHeader.join(','), ...csvRows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'admin_weekly_bonus_report.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export data:", err);
      alert("An error occurred during export.");
    } finally {
      setIsExporting(false);
    }
  };

  if (sessionLoading) {
    return <div className="text-center p-10">Loading session...</div>;
  }
  
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-8 max-w-7xl mx-auto">
      <ReportHeader
        title="Admin Weekly Bonus Report"
        description="Monitor all weekly bonus distributions to users."
        stats={stats}
      />

      {/* Filter and Action Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center p-4 bg-black/50 border border-amber-50 rounded-xl">
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by user name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-64 bg-transparent"
            />
          </div>
          <Input
            type="date"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
            className="w-full sm:w-auto bg-transparent"
          />
          <Input
            type="date"
            value={endDateFilter}
            onChange={(e) => setEndDateFilter(e.target.value)}
            className="w-full sm:w-auto bg-transparent"
          />
        </div>
        <Button onClick={handleExportCsv} disabled={isExporting} className="w-full md:w-auto">
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "Exporting..." : "Export CSV"}
        </Button>
      </div>
      
      <div className="bg-black/50 border border-amber-50 rounded-xl shadow-sm p-4 sm:p-6">
        {loading ? (
          <div className="text-center py-8">Loading report...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">Error: {error}</div>
        ) : data.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            No weekly bonus transactions found for the selected criteria.
          </div>
        ) : (
          <>
            <DataTable columns={columns} data={data} searchColumn="none" />
            {/* Pagination Controls */}
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(p => ({...p, page: p.page - 1}))}
                disabled={pagination.page <= 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(p => ({...p, page: p.page + 1}))}
                disabled={pagination.page >= pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
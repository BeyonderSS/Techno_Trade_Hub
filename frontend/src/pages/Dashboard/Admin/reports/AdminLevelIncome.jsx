"use client";

import { useState, useEffect, useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import ReportHeader from "@/components/report-header";
import { Badge } from "../../../../components/ui/batch";
import { DollarSign, LineChart, Download, CalendarDays } from "lucide-react"; // Import Download and CalendarDays icons
import { getLevelIncomeReportApi } from "../../../../api/reports.api";
import { useSession } from "../../../../context/SessionContext"; // Import useSession

export default function AdminLevelIncomePage() {
  const { user, loading: sessionLoading } = useSession(); // Get user and session loading status
  const [data, setData] = useState([]); // State to store fetched level income data
  const [loading, setLoading] = useState(true); // State for data fetching loading indicator
  const [error, setError] = useState(null); // State for storing fetch errors

  // States for date filtering
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  // Function to fetch level income data based on current filters and user session
  const fetchData = async () => {
    // Only proceed if user session is loaded and user ID is available
    if (!sessionLoading && user?.id) {
      setLoading(true); // Start loading
      setError(null); // Clear previous errors

      try {
        const filters = {
          page: 1, // Reset to first page on filter change
          limit: 100, // Fetch up to 100 records for demonstration, adjust as needed
        };

        if (startDateFilter) {
          filters.startDate = startDateFilter;
        }
        if (endDateFilter) {
          // Adjust endDate to include the entire selected day
          const end = new Date(endDateFilter);
          end.setDate(end.getDate() + 1); // Add one day to include the full end date
          filters.endDate = end.toISOString().split('T')[0]; // Format to YYYY-MM-DD
        }

        const response = await getLevelIncomeReportApi(user.id, filters);
        setData(response.data); // Update data state with fetched data
      } catch (err) {
        console.error("Error fetching level income report:", err);
        setError(err.message || "Failed to load level income report.");
      } finally {
        setLoading(false); // End loading
      }
    } else if (!sessionLoading && !user?.id) {
      // Handle case where session is loaded but user is not authenticated
      setLoading(false);
      setError("User not authenticated. Please log in to view level income report.");
    }
  };

  // useEffect hook to trigger data fetching when filters or session status change
  useEffect(() => {
    fetchData();
  }, [user, sessionLoading, startDateFilter, endDateFilter]); // Dependencies for re-fetching

  // Column definitions for the DataTable, memoized for performance
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
      cell: ({ row }) => (
        <div>{new Date(row.original.transactionDate).toLocaleDateString()}</div>
      ),
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
    {
      accessorKey: "adminActionNotes",
      header: "Notes",
      cell: ({ row }) => (
        <div
          className="max-w-[250px] truncate text-sm sm:text-base"
          title={row.original.adminActionNotes}
        >
          {row.original.adminActionNotes || 'N/A'}
        </div>
      ),
    },
  ], []);

  // Dynamically calculate statistics based on fetched data, memoized for performance
  const totalLevelIncome = useMemo(() => {
    return data.reduce((sum, transaction) => sum + (transaction.amount || 0), 0);
  }, [data]);

  const lastPaymentDate = useMemo(() => {
    if (data.length === 0) return "N/A";
    const sortedData = [...data].sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));
    return new Date(sortedData[0].transactionDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [data]);

  // Statistics array passed to ReportHeader
  const stats = [
    {
      label: "Total Level Income",
      value: `$${totalLevelIncome.toFixed(2)}`,
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      label: "Last Payment",
      value: lastPaymentDate,
      icon: <CalendarDays className="h-5 w-5" />,
    },
  ];

  // Function to handle exporting data to CSV
  const handleExportCsv = () => {
    if (data.length === 0) {
      alert("No data to export."); // Using alert for simplicity, consider a custom modal
      return;
    }

    const csvHeader = [
      "Transaction ID", "User Name", "User Email", "Amount", "Date", "Status", "Notes"
    ];

    const csvRows = data.map(row => {
      const userName = row.userId?.name || 'N/A';
      const userEmail = row.userId?.email || 'N/A';
      const amount = row.amount?.toFixed(2) || "0.00";
      const transactionDate = new Date(row.transactionDate).toLocaleDateString();
      const status = row.status;
      const notes = row.adminActionNotes || 'N/A';

      // Helper function to escape fields for CSV format
      const escapeCsvField = (field) => {
        if (typeof field === 'string' && (field.includes(',') || field.includes('"') || field.includes('\n'))) {
          return `"${field.replace(/"/g, '""')}"`;
        }
        return field;
      };

      return [
        escapeCsvField(row.txnId),
        escapeCsvField(userName),
        escapeCsvField(userEmail),
        escapeCsvField(amount),
        escapeCsvField(transactionDate),
        escapeCsvField(status),
        escapeCsvField(notes)
      ];
    });

    const csvContent = [
      csvHeader.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'level_income_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Render loading state
  if (loading || sessionLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-10 max-w-7xl mx-auto flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="text-white text-lg">Loading level income report...</div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-10 max-w-7xl mx-auto flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-8 max-w-7xl mx-auto">
      <ReportHeader
        title="Level Income"
        description="Track your level income transactions from your referral network"
        stats={stats}
      />



      <div className="bg-black/50 border border-amber-50 rounded-xl shadow-sm p-4 sm:p-6">
        {data.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            No level income transactions found for the selected period.
          </div>
        ) : (
          <DataTable columns={columns} data={data} searchColumn="txnId" />
        )}
      </div>
    </div>
  );
}

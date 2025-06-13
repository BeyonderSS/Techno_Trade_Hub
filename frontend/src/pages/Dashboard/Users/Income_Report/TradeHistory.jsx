"use client";

import { useState, useEffect, useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import ReportHeader from "@/components/report-header";
import { Badge } from "../../../../components/ui/batch";
import { DollarSign, TrendingUp, Download } from "lucide-react"; // Import Download icon
import { getTradeHistoryReportApi } from "../../../../api/reports.api";
import { useSession } from "../../../../context/SessionContext"; // Import useSession

export default function TradeHistoryPage() {
  const { user, loading: sessionLoading } = useSession(); // Get user and session loading status
  const [data, setData] = useState([]); // State to store fetched trade history data
  const [loading, setLoading] = useState(true); // State for data fetching loading indicator
  const [error, setError] = useState(null); // State for storing fetch errors

  // States for date filtering
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  // Function to fetch trade history data based on current filters and user session
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
          filters.endDate = end.toISOString().split("T")[0]; // Format to YYYY-MM-DD
        }

        const response = await getTradeHistoryReportApi(user.id, filters);
        setData(response.data); // Update data state with fetched data
      } catch (err) {
        console.error("Error fetching trade history report:", err);
        setError(err.message || "Failed to load trade history report.");
      } finally {
        setLoading(false); // End loading
      }
    } else if (!sessionLoading && !user?.id) {
      // Handle case where session is loaded but user is not authenticated
      setLoading(false);
      setError(
        "User not authenticated. Please log in to view trade history report."
      );
    }
  };

  // useEffect hook to trigger data fetching when filters or session status change
  useEffect(() => {
    fetchData();
  }, [user, sessionLoading, startDateFilter, endDateFilter]); // Dependencies for re-fetching

  // Column definitions for the DataTable, memoized for performance
  const columns = useMemo(
    () => [
      {
        accessorKey: "txnId",
        header: "Transaction ID",
      },
      {
        accessorKey: "userId.name",
        header: "User",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">
              {row.original.userId?.name || "N/A"}
            </div>
            <div className="text-sm text-muted-foreground">
              {row.original.userId?.email || "N/A"}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "amount",
        header: "Payout Amount", // Renamed for clarity
        cell: ({ row }) => (
          <div className="font-medium text-right">
            ${row.original.amount?.toFixed(2) || "0.00"}
          </div>
        ),
      },
      {
        accessorKey: "transactionDate",
        header: "Date",
        cell: ({ row }) => (
          <div>
            {new Date(row.original.transactionDate).toLocaleDateString()}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.status === "completed" ? "success" : "default"
            }
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: "relatedEntityId.amount",
        header: "Investment Amount",
        cell: ({ row }) => (
          <div className="font-medium text-right">
            {/* Check if relatedEntityId and its amount property exist */}$
            {row.original.relatedEntityId?.amount?.toFixed(2) || "0.00"}
          </div>
        ),
      },
      {
        accessorKey: "adminFeeApplied",
        header: "Admin Fee",
        cell: ({ row }) => (
          <div className="text-right">
            ${row.original.adminFeeApplied?.toFixed(2) || "0.00"}
          </div>
        ),
      },
    ],
    []
  );

  // Dynamically calculate statistics based on fetched data, memoized for performance
  const totalROIPayouts = useMemo(() => {
    return data.reduce(
      (sum, transaction) => sum + (transaction.amount || 0),
      0
    );
  }, [data]);

  const totalInvestmentAmount = useMemo(() => {
    // Sum unique investment amounts, assuming each ROI payout links to a specific investment
    // This might be a simplified calculation, depending on how `relatedEntityId` is structured
    const uniqueInvestments = new Map();
    data.forEach((transaction) => {
      if (transaction.relatedEntityId && transaction.relatedEntityId.amount) {
        uniqueInvestments.set(
          transaction.relatedEntityId._id,
          transaction.relatedEntityId.amount
        );
      }
    });
    return Array.from(uniqueInvestments.values()).reduce(
      (sum, amount) => sum + amount,
      0
    );
  }, [data]);

  const totalAdminFees = useMemo(() => {
    return data.reduce(
      (sum, transaction) => sum + (transaction.adminFeeApplied || 0),
      0
    );
  }, [data]);

  // Statistics array passed to ReportHeader
  const stats = [
    {
      label: "Total ROI Payouts",
      value: `$${totalROIPayouts.toFixed(2)}`,
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      label: "Total Investment Amount",
      value: `$${totalInvestmentAmount.toFixed(2)}`,
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      label: "Total Admin Fees",
      value: `$${totalAdminFees.toFixed(2)}`,
      icon: <DollarSign className="h-5 w-5" />,
    },
  ];

  // Function to handle exporting data to CSV
  const handleExportCsv = () => {
    if (data.length === 0) {
      alert("No data to export."); // Using alert for simplicity, consider a custom modal
      return;
    }

    const csvHeader = [
      "Transaction ID",
      "User Name",
      "User Email",
      "Payout Amount",
      "Date",
      "Status",
      "Investment ID",
      "Investment Amount",
      "Investment Start Date",
      "Investment Status",
      "Admin Fee",
    ];

    const csvRows = data.map((row) => {
      const userName = row.userId?.name || "N/A";
      const userEmail = row.userId?.email || "N/A";
      const payoutAmount = row.amount?.toFixed(2) || "0.00";
      const transactionDate = new Date(
        row.transactionDate
      ).toLocaleDateString();
      const status = row.status;
      const investmentId = row.relatedEntityId?._id || "N/A";
      const investmentAmount =
        row.relatedEntityId?.amount?.toFixed(2) || "0.00";
      const investmentStartDate = row.relatedEntityId?.startDate
        ? new Date(row.relatedEntityId.startDate).toLocaleDateString()
        : "N/A";
      const investmentStatus = row.relatedEntityId?.status || "N/A";
      const adminFee = row.adminFeeApplied?.toFixed(2) || "0.00";

      // Helper function to escape fields for CSV format
      const escapeCsvField = (field) => {
        if (
          typeof field === "string" &&
          (field.includes(",") || field.includes('"') || field.includes("\n"))
        ) {
          return `"${field.replace(/"/g, '""')}"`;
        }
        return field;
      };

      return [
        escapeCsvField(row.txnId),
        escapeCsvField(userName),
        escapeCsvField(userEmail),
        escapeCsvField(payoutAmount),
        escapeCsvField(transactionDate),
        escapeCsvField(status),
        escapeCsvField(investmentId),
        escapeCsvField(investmentAmount),
        escapeCsvField(investmentStartDate),
        escapeCsvField(investmentStatus),
        escapeCsvField(adminFee),
      ];
    });

    const csvContent = [
      csvHeader.join(","),
      ...csvRows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "trade_history_report.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Render loading state
  if (loading || sessionLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-10 max-w-7xl mx-auto flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="text-white text-lg">
          Loading trade history report...
        </div>
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
        title="Trade History"
        description="Track your ROI payout transactions from investments"
        stats={stats}
      />

      <div className="bg-black/50 border border-amber-50 rounded-xl shadow-sm p-4 sm:p-6">
        {data.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            No trade history (ROI payouts) found for the selected period.
          </div>
        ) : (
          <DataTable columns={columns} data={data} searchColumn="txnId" />
        )}
      </div>
    </div>
  );
}

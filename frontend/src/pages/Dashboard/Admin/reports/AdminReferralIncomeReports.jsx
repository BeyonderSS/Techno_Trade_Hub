// src/pages/AdminReferralIncomePage.jsx
import { useState, useEffect, useMemo, useCallback } from "react";
import { DataTable } from "@/components/ui/data-table";
import ReportHeader from "@/components/report-header";
import { Badge } from "@/components/ui/badge"; // Corrected import path
import { Users, DollarSign, ListChecks } from "lucide-react";
import { getAdminReferralBonusDistributionReportApi } from "../../../../api/adminreports";
import { useDebounce } from "@/hooks/useDebounce"; // Assuming you have a debounce hook for search

// Mock useDebounce hook if you don't have one
// const useDebounce = (value, delay) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   useEffect(() => {
//     const handler = setTimeout(() => setDebouncedValue(value), delay);
//     return () => clearTimeout(handler);
//   }, [value, delay]);
//   return debouncedValue;
// };

export default function AdminReferralBonusDistributionPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for filters and pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

  // Debounce the search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Memoize the API call logic
  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        searchUser: debouncedSearchTerm,
        startDate: dateRange.startDate || undefined,
        endDate: dateRange.endDate || undefined,
      };
      // Filter out undefined params
      const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== ''));

      const response = await getAdminReferralBonusDistributionReportApi(filteredParams);
      console.log(response,"frontend referral bonus admin console ");
      setData(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error("Error fetching admin report:", err);
      setError(err.message || "Failed to load report.");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearchTerm, dateRange]);

  // Fetch data when filters or page changes
  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const columns = useMemo(() => [
    {
      accessorKey: "txnId",
      header: "Transaction ID",
    },
    {
      accessorKey: "userId", // Changed accessor key
      header: "Bonus Recipient",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.userId?.name || 'N/A'}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.userId?.email || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "relatedEntityId", // Changed accessor key
      header: "From User (Referral)",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.relatedEntityId?.name || 'N/A'}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.relatedEntityId?.email || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Amount</div>,
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
  ], []);
  
  // Note: Total income should ideally be calculated and sent from the backend
  // to be accurate across all pages. The backend does not currently provide this.
  // We are using the total transaction count from pagination instead.
  const stats = [
    {
      label: "Total Transactions",
      value: pagination.total,
      icon: <ListChecks className="h-5 w-5" />,
    },
    // Add other relevant stats if your backend provides them.
    // {
    //   label: "Total Bonus Distributed",
    //   value: `$${(pagination.totalAmount || 0).toFixed(2)}`,
    //   icon: <DollarSign className="h-5 w-5" />,
    // },
  ];

  if (error) {
    console.error(error)
    return (
      <div className="px-4 py-8 max-w-7xl mx-auto flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-10 max-w-7xl mx-auto">
      <ReportHeader
        title="Referral Bonus Distribution"
        description="Monitor all direct referral bonuses paid out to users."
        stats={stats}
        // Pass filter handlers to your header component
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onDateChange={(dates) => setDateRange(dates)} // Assuming ReportHeader can handle this
      />
      <div className="bg-black/40 border border-amber-50 dark:bg-black/50 shadow rounded-xl p-4 sm:p-6">
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          // Pass pagination state and handlers to your DataTable
          pageCount={pagination.totalPages}
          pageIndex={pagination.page - 1}
          pageSize={pagination.limit}
          onPageChange={(page) => setPagination(p => ({ ...p, page: page + 1 }))}
          onPageSizeChange={(size) => setPagination({ page: 1, limit: size })}
          searchColumn="userId.name" // Update search column if needed
          searchPlaceholder="Search by recipient name..."
        />
      </div>
    </div>
  );
}
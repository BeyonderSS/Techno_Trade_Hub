import { useState, useEffect, useMemo } from "react"; // Import useEffect and useMemo
import { DataTable } from "@/components/ui/data-table";
import ReportHeader from "@/components/report-header";
import { Badge } from "../../../../components/ui/batch";
import { Users, DollarSign } from "lucide-react";
import { getReferralIncomeReportApi } from "../../../../api/reports.api";
import { useSession } from "../../../../context/SessionContext";

export default function AdminReferralIncomePage() {
  const { user, loading: sessionLoading } = useSession(); // Destructure user and rename loading to avoid conflict
  const [data, setData] = useState([]); // State to hold fetched data
  const [loading, setLoading] = useState(true); // State for data fetching loading
  const [error, setError] = useState(null); // State for errors

  // Fetch data when component mounts or user session changes
  useEffect(() => {
    const fetchReferralIncome = async () => {
      // Only proceed if session is not loading and user object is available
      if (!sessionLoading && user?.id) {
        setLoading(true); // Set loading to true before fetching
        setError(null); // Clear any previous errors
        try {
          // Pass the user's ID and any desired filters (e.g., page, limit)
          const response = await getReferralIncomeReportApi(user.id, { page: 1, limit: 100 }); // Fetch up to 100 records for simplicity
          setData(response.data);
        } catch (err) {
          console.error("Error fetching referral income report:", err);
          setError(err.message || "Failed to load referral income report.");
        } finally {
          setLoading(false); // Set loading to false after fetch attempt
        }
      } else if (!sessionLoading && !user?.id) {
        // Handle case where session is loaded but no user ID is available (e.g., not logged in)
        setLoading(false);
        setError("User not authenticated. Please log in.");
      }
    };

    fetchReferralIncome();
  }, [user, sessionLoading]); // Re-run effect if user or sessionLoading changes

  // Memoize column definitions to prevent unnecessary re-renders
  const columns = useMemo(() => [
    {
      accessorKey: "txnId",
      header: "Transaction ID",
    },
    {
      accessorKey: "userId.name", // Displaying the name of the user who received the bonus
      header: "Recipient User",
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
      accessorKey: "amount",
      header: "Amount",
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
        <Badge
          variant={row.original.status === "completed" ? "success" : "default"}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "relatedEntityDetails",
      header: "Referral Details",
      cell: ({ row }) => {
        const details = row.original.relatedEntityDetails;
        if (!details) {
          return <div>N/A</div>;
        }
        return (
          <div>
            <div className="font-medium">
              Type: {details.type}
            </div>
            <div className="text-sm text-muted-foreground">
              {details.type === "User"
                ? `Name: ${details.name || 'N/A'} (Email: ${details.email || 'N/A'})`
                : details.type === "Investment"
                ? `Amount: $${(details.amount || 0).toFixed(2)} (Status: ${details.status || 'N/A'})`
                : 'N/A'
              }
            </div>
          </div>
        );
      },
    },
  ], []);

  // Calculate total income and referral count dynamically
  const totalReferralIncome = useMemo(() => {
    return data.reduce((sum, transaction) => sum + (transaction.amount || 0), 0);
  }, [data]);

  const totalReferrals = useMemo(() => {
    // Count unique users who triggered a direct referral bonus
    const referredUserIds = new Set();
    data.forEach(transaction => {
      if (transaction.relatedEntityDetails?.type === 'User') {
        referredUserIds.add(transaction.relatedEntityDetails._id);
      }
    });
    return referredUserIds.size;
  }, [data]);

  const stats = [
    {
      label: "Total Referral Income",
      value: `$${totalReferralIncome.toFixed(2)}`,
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      label: "Total Referrals",
      value: totalReferrals.toString(),
      icon: <Users className="h-5 w-5" />,
    },
  ];

  if (loading || sessionLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-10 max-w-7xl mx-auto flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="text-white text-lg">Loading referral income report...</div>
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
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-10 max-w-7xl mx-auto">
      <ReportHeader
        title="Referral Income"
        description="Track your direct referral bonuses and related details"
        stats={stats}
      />
      <div className="bg-black/40 border border-amber-50 dark:bg-black/50 shadow rounded-xl p-4 sm:p-6">
        {data.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            No referral income transactions found.
          </div>
        ) : (
          <DataTable columns={columns} data={data} searchColumn="txnId" />
        )}
      </div>
    </div>
  );
}

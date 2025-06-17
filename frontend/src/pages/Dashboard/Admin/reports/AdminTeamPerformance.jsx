"use client";

import { useState, useEffect, useMemo } from "react"; // Import useEffect and useMemo
import { DataTable } from "@/components/ui/data-table";
import ReportHeader from "@/components/report-header";
import { Progress } from "@/components/ui/progress";
import { Users, Wallet } from "lucide-react";
import { getTeamPerformanceReportApi } from "../../../../api/reports.api"; // Import the API function
import { useSession } from "../../../../context/SessionContext"; // Import useSession

export default function AdminTeamPerformancePage() {
  const { user, loading: sessionLoading } = useSession(); // Get user and session loading status
  const [data, setData] = useState([]); // State to store fetched team performance data
  const [loading, setLoading] = useState(true); // State for data fetching loading indicator
  const [error, setError] = useState(null); // State for storing fetch errors

  // Function to fetch team performance data based on the current user session
  const fetchData = async () => {
    // Only proceed if user session is loaded and user ID is available
    if (!sessionLoading && user?.id) {
      setLoading(true); // Start loading
      setError(null); // Clear previous errors

      try {
        // Pass the user's ID as the root user for the team report
        // No filters (like page, limit, memberSearch) are applied as per request.
        const response = await getTeamPerformanceReportApi(user.id, { page: 1, limit: 100 }); // Fetch up to 100 members
        setData(response.data); // Update data state with fetched data
      } catch (err) {
        console.error("Error fetching team performance report:", err);
        setError(err.message || "Failed to load team performance report.");
      } finally {
        setLoading(false); // End loading
      }
    } else if (!sessionLoading && !user?.id) {
      // Handle case where session is loaded but user is not authenticated
      setLoading(false);
      setError("User not authenticated. Please log in to view team performance.");
    }
  };

  // useEffect hook to trigger data fetching when user or session status change
  useEffect(() => {
    fetchData();
  }, [user, sessionLoading]); // Dependencies for re-fetching

  // Column definitions for the DataTable, memoized for performance
  const columns = useMemo(() => [
    {
      accessorKey: "name",
      header: "Team Member",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name || 'N/A'}</div>
          <div className="text-sm text-muted-foreground">{row.original.email || 'N/A'}</div>
        </div>
      ),
    },
    {
      accessorKey: "walletBalance",
      header: "Wallet Balance",
      cell: ({ row }) => (
        <div className="font-medium text-right">${row.original.walletBalance?.toFixed(2) || "0.00"}</div>
      ),
    },
    {
      accessorKey: "directReferralCount",
      header: "Direct Referrals",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <span className="font-medium">{row.original.directReferralCount || 0}</span>
          {/* Progress value scaled for visual representation, assuming max relevant direct referrals for UI is around 5 */}
          <Progress value={(row.original.directReferralCount || 0) * 20} className="h-2 w-[80px] sm:w-[100px]" />
        </div>
      ),
    },
    {
      accessorKey: "performance",
      header: "Performance",
      cell: ({ row }) => {
        const count = row.original.directReferralCount || 0;
        let label = "Low";
        let color = "text-red-500";

        if (count >= 5) { // Assuming 5+ direct referrals is excellent
          label = "Excellent";
          color = "text-green-500";
        } else if (count >= 3) { // Assuming 3-4 direct referrals is good
          label = "Good";
          color = "text-amber-500";
        } else if (count >= 1) { // Assuming 1-2 direct referrals is average
          label = "Average";
          color = "text-blue-500";
        }

        return <span className={`font-medium ${color}`}>{label}</span>;
      },
    },
  ], []);

  // Dynamically calculate statistics based on fetched data, memoized for performance
  const totalTeamMembers = useMemo(() => {
    return data.length;
  }, [data]);

  const totalReferrals = useMemo(() => {
    return data.reduce((sum, member) => sum + (member.directReferralCount || 0), 0);
  }, [data]);

  const totalWalletBalance = useMemo(() => {
    return data.reduce((sum, member) => sum + (member.walletBalance || 0), 0);
  }, [data]);

  // Statistics array passed to ReportHeader
  const stats = [
    {
      label: "Total Team Members",
      value: totalTeamMembers.toString(),
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Total Referrals",
      value: totalReferrals.toString(),
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Total Wallet Balance",
      value: `$${totalWalletBalance.toFixed(2)}`,
      icon: <Wallet className="h-5 w-5" />,
    },
  ];

  // Render loading state
  if (loading || sessionLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-10 max-w-7xl mx-auto flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="text-white text-lg">Loading team performance report...</div>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <ReportHeader
        title="Team Performance"
        description="Analyze your team's performance metrics and referral counts"
        stats={stats}
      />
      <div className="bg-black/50 border border-amber-50 dark:bg-black/50 rounded-xl shadow p-4 sm:p-6">
        {data.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            No team members found or associated with your account.
          </div>
        ) : (
          <DataTable columns={columns} data={data} searchColumn="name" />
        )}
      </div>
    </div>
  );
}

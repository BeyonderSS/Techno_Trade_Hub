"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WithdrawalTable } from "../../../../components/Withdrawl/WithdrawalTable";
import { WithdrawalDialog } from "../../../../components/Withdrawl/WithdrawalDialog";
import { getWithdrawalHistoryApi } from "../../../../api/investment.api";
import { useSession } from "../../../../context/SessionContext";

export default function UserWithdrawalsPage() {
  const { user, loading: sessionLoading } = useSession(); // Get user object and session loading state
  const [withdrawals, setWithdrawals] = useState([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Corresponds to 'limit' in API
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect to fetch data from the API
  const fetchWithdrawals = async () => {
    // Only attempt to fetch if user._id is available and session has finished loading
    if (!user?.id || sessionLoading) {
      setDataLoading(false); // No data to load yet or user not logged in
      return;
    }

    setDataLoading(true);
    setError(null); // Clear any previous errors

    try {
      const filters = {
        page: currentPage,
        limit: itemsPerPage,
        // Current setup: searchTerm and statusFilter are handled client-side.
        // If you want server-side filtering, you'd pass them here:
        // status: statusFilter !== 'all' ? statusFilter : undefined,
        // searchTerm: searchTerm || undefined, // Backend would need to support this
      };

      const response = await getWithdrawalHistoryApi(user.id, filters);
      console.log(response);
      setWithdrawals(response.data); // Store raw data for client-side filtering
      setFilteredWithdrawals(response.data); // Initialize filtered data
      setTotalItems(response.pagination.total);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      console.error("Error fetching withdrawal history:", err);
      setError(err.message || "Failed to load withdrawal history.");
    } finally {
      setDataLoading(false);
    }
  };
  useEffect(() => {
    fetchWithdrawals();
  }, [user?._id, sessionLoading, currentPage, itemsPerPage]); // Dependencies for re-fetching data

  // Effect to apply client-side filtering whenever search/status filters or raw withdrawals change
  useEffect(() => {
    let result = withdrawals;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.txnId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.cryptoWalletAddress
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (item.adminActionNotes &&
            item.adminActionNotes
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }

    setFilteredWithdrawals(result);
  }, [searchTerm, statusFilter, withdrawals]); // Dependencies for re-filtering data

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-purple-400">Withdrawals</h1>
            <p className="text-gray-400">Manage your withdrawal transactions</p>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            Raise a Withdrawal Request
          </Button>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div>
            <Input
              placeholder="Search by TxnID, wallet address or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-900 border-gray-800 text-gray-100 placeholder:text-gray-500"
            />
          </div>
          <div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-gray-900 border-gray-800 text-gray-100">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800 text-gray-100">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {dataLoading ? (
          <div className="text-center text-gray-400 py-10">
            Loading withdrawal history...
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-10">Error: {error}</div>
        ) : (
          <>
            <div className="rounded-lg border border-gray-800 bg-gray-900 shadow-lg">
              {/* Ensure WithdrawalTable can handle an empty array gracefully */}
              <WithdrawalTable withdrawals={filteredWithdrawals} />
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-6">
              <Button
                onClick={handlePrevPage}
                disabled={currentPage === 1 || dataLoading}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300"
              >
                Previous
              </Button>
              <span className="text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages || dataLoading}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300"
              >
                Next
              </Button>
            </div>
          </>
        )}

        <WithdrawalDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSucceess={fetchWithdrawals}
        />
      </div>
    </div>
  );
}

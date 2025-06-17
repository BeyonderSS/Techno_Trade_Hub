"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react"; // Import QR code generator

import {
  getAllPendingWithdrawalRequestsApi,
  getAllWithdrawalsApi, // This API currently fetches 'completed' withdrawals
  approveWithdrawalRequestApi,
  rejectWithdrawalRequestApi,
} from "../../../../api/investment.api"; // Adjust path as needed
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BanknoteArrowDown } from "lucide-react";

// A dummy admin notes state for approve/reject dialogs (can be extended to an input)
const DEFAULT_ADMIN_NOTES = "Action processed by admin.";

export default function AdminWithdrawalsPage() {
  const [allWithdrawals, setAllWithdrawals] = useState([]); // Stores all data after combining
  const [filteredWithdrawals, setFilteredWithdrawals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending"); // Default to 'pending' requests
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Dialogs and selected transaction for actions/details
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmActionType, setConfirmActionType] = useState(null); // 'approve' or 'reject'
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // Function to fetch data based on filters
  const fetchWithdrawalRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let pendingRequests = [];
      let completedRequests = [];

      // Always fetch pending requests
      const pendingRes = await getAllPendingWithdrawalRequestsApi({
        page: currentPage,
        limit: itemsPerPage,
        // Backend doesn't support search for pending, so search handled client-side
      });
      pendingRequests = pendingRes.data;

      if (statusFilter === "all") {
        // If 'all' is selected, also fetch completed withdrawals
        const completedRes = await getAllWithdrawalsApi({
          // This is backend's getAllWithdrawals (for 'completed')
          page: currentPage, // Note: Pagination might need to be adjusted if combining large datasets
          limit: itemsPerPage,
          // Backend doesn't support search for completed, so search handled client-side
        });
        completedRequests = completedRes.data;
        // Combine and de-duplicate if necessary (though _id should prevent full duplicates)
        const combined = [...pendingRequests, ...completedRequests];
        setAllWithdrawals(combined); // Store combined for client-side filtering
        setTotalItems(
          pendingRes.pagination.total + completedRes.pagination.total
        ); // Simple sum for total
        setTotalPages(
          Math.ceil(
            (pendingRes.pagination.total + completedRes.pagination.total) /
            itemsPerPage
          )
        );
      } else if (statusFilter === "pending") {
        setAllWithdrawals(pendingRequests);
        setTotalItems(pendingRes.pagination.total);
        setTotalPages(pendingRes.pagination.totalPages);
      } else if (statusFilter === "completed") {
        // If 'completed' is selected, only show completed withdrawals
        const completedRes = await getAllWithdrawalsApi({
          page: currentPage,
          limit: itemsPerPage,
        });
        completedRequests = completedRes.data;
        setAllWithdrawals(completedRequests);
        setTotalItems(completedRes.pagination.total);
        setTotalPages(completedRes.pagination.totalPages);
      }
    } catch (err) {
      console.error("Error fetching withdrawal requests:", err);
      setError(err.message || "Failed to load withdrawal requests.");
      toast.error(err.message || "Failed to load withdrawal requests.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, statusFilter]); // Re-fetch when these change

  useEffect(() => {
    fetchWithdrawalRequests();
  }, [fetchWithdrawalRequests]); // Initial fetch and refetch on filter/pagination change

  // Apply client-side filtering and searching
  useEffect(() => {
    let result = allWithdrawals;

    // Apply status filter for client-side display consistency
    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.txnId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.cryptoWalletAddress
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || // Search by user name
          item.userId?.email
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) || // Search by user email
          (item.adminActionNotes &&
            item.adminActionNotes
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredWithdrawals(result);
  }, [searchTerm, statusFilter, allWithdrawals]);

  // Handlers for action buttons
  const handleApproveClick = (transaction) => {
    setSelectedTransaction(transaction);
    setConfirmActionType("approve");
    setIsConfirmDialogOpen(true);
  };

  const handleRejectClick = (transaction) => {
    setSelectedTransaction(transaction);
    setConfirmActionType("reject");
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedTransaction) return;

    setLoading(true); // Indicate loading for the action
    try {
      if (confirmActionType === "approve") {
        const response = await approveWithdrawalRequestApi(
          selectedTransaction._id,
          DEFAULT_ADMIN_NOTES
        );
        toast.success(response.message || "Withdrawal request approved!");
      } else if (confirmActionType === "reject") {
        const response = await rejectWithdrawalRequestApi(
          selectedTransaction._id,
          DEFAULT_ADMIN_NOTES
        );
        toast.success(
          response.message ||
          "Withdrawal request rejected and amount credited back!"
        );
      }
      setIsConfirmDialogOpen(false); // Close dialog
      setSelectedTransaction(null); // Clear selected transaction
      fetchWithdrawalRequests(); // Re-fetch data to update table
    } catch (err) {
      console.error(`Error ${confirmActionType}ing withdrawal:`, err);
      setError(err.message || `Failed to ${confirmActionType} withdrawal.`);
      toast.error(err.message || `Failed to ${confirmActionType} withdrawal.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsDialogOpen(true);
  };

  // Pagination handlers
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

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-500";
      case "pending":
        return "text-yellow-500";
      case "failed":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-purple-400 flex items-center gap-3">
              Admin Withdrawals
              <BanknoteArrowDown className="h-8 w-8 text-purple-700" />
            </h1>
            <p className="text-gray-400 text-sm">
              Review and manage user withdrawal requests.
            </p>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Input
              placeholder="Search by TxnID, wallet, or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-900 border-gray-800 text-gray-100 placeholder:text-gray-500 focus:border-purple-500"
            />
          </div>
          <div className="md:col-span-1">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-gray-900 border-gray-800 text-gray-100 focus:ring-purple-500">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800 text-gray-100">
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="pending">Pending Requests</SelectItem>
                <SelectItem value="completed">Completed Withdrawals</SelectItem>
                <SelectItem value="failed">Failed Withdrawals</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Add more filters if needed */}
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-10">
            Loading withdrawal requests...
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-10">Error: {error}</div>
        ) : filteredWithdrawals.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            No withdrawal requests found for the current filters.
          </div>
        ) : (
          <>
            <div className="rounded-lg border border-gray-800 bg-gray-900 shadow-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-800 border-gray-700">
                    <TableHead className="text-gray-300">TxnID</TableHead>
                    <TableHead className="text-gray-300">User</TableHead>
                    <TableHead className="text-gray-300">Amount</TableHead>
                    <TableHead className="text-gray-300">Fee</TableHead>
                    <TableHead className="text-gray-300">
                      Wallet Address
                    </TableHead>
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300 text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWithdrawals.map((withdrawal) => (
                    <TableRow
                      key={withdrawal._id}
                      className="border-gray-800 hover:bg-gray-850"
                    >
                      <TableCell className="font-medium text-gray-200">
                        {withdrawal.txnId || withdrawal._id}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {withdrawal.userId
                          ? `${withdrawal.userId.name} (${withdrawal.userId.email})`
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-gray-200">
                        $
                        {withdrawal.amount
                          ? withdrawal.amount.toFixed(2)
                          : "0.00"}
                      </TableCell>
                      <TableCell className="text-gray-200">
                        $
                        {withdrawal.adminFeeApplied
                          ? withdrawal.adminFeeApplied.toFixed(2)
                          : "0.00"}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {withdrawal.cryptoWalletAddress
                          ? `${withdrawal.cryptoWalletAddress.substring(
                            0,
                            6
                          )}...${withdrawal.cryptoWalletAddress.substring(
                            withdrawal.cryptoWalletAddress.length - 4
                          )}`
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {format(new Date(withdrawal.transactionDate), "PPP p")}
                      </TableCell>
                      <TableCell
                        className={`font-semibold ${getStatusColor(
                          withdrawal.status
                        )}`}
                      >
                        {withdrawal.status.charAt(0).toUpperCase() +
                          withdrawal.status.slice(1)}
                      </TableCell>
                      <TableCell className="flex space-x-2 justify-center">
                        {withdrawal.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700"
                              onClick={() => handleApproveClick(withdrawal)}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
                              onClick={() => handleRejectClick(withdrawal)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        <Button
                          variant="secondary"
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
                          onClick={() => handleDetailsClick(withdrawal)}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-6">
              <Button
                onClick={handlePrevPage}
                disabled={currentPage === 1 || loading}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700"
              >
                Previous
              </Button>
              <span className="text-gray-300">
                Page {currentPage} of {totalPages} (Total: {totalItems})
              </span>
              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages || loading}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700"
              >
                Next
              </Button>
            </div>
          </>
        )}

        {/* Confirmation Dialog for Approve/Reject */}
        <AlertDialog
          open={isConfirmDialogOpen}
          onOpenChange={setIsConfirmDialogOpen}
        >
          <AlertDialogContent className="bg-gray-900 text-gray-100 border-gray-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-purple-400">
                Confirm{" "}
                {confirmActionType === "approve" ? "Approval" : "Rejection"}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Are you sure you want to {confirmActionType} this withdrawal
                request for ${selectedTransaction?.amount.toFixed(2)} from{" "}
                {selectedTransaction?.userId?.name || "N/A"}? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmAction}
                className={
                  confirmActionType === "approve"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : confirmActionType === "approve"
                    ? "Approve"
                    : "Reject"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Details Dialog */}
        <Dialog
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
        >
          <DialogContent className="sm:max-w-[500px] bg-gray-900 text-gray-100 border-gray-800">
            <DialogHeader>
              <DialogTitle className="text-xl text-purple-400">
                Withdrawal Request Details
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Detailed information for Transaction ID:{" "}
                {selectedTransaction?.txnId || selectedTransaction?._id}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-96">
              <div className="grid gap-4 py-4">
                {/* QR Code Section */}
                {selectedTransaction?.cryptoWalletAddress &&
                  selectedTransaction?.amount > 0 && (
                    <div className="text-center mt-6 p-4 border border-gray-700 rounded-md bg-gray-800">
                      <Label className="text-gray-300 mb-2 block">
                        Scan to Pay (USDT)
                      </Label>
                      <div className="p-2 bg-gray-100 rounded-md inline-block">
                        {" "}
                        {/* QR code background */}
                        <QRCodeSVG
                          value={selectedTransaction.cryptoWalletAddress} // Simple QR data format
                          size={200}
                          level="H"
                          renderAs="svg"
                          className="rounded-md"
                        />
                      </div>
                      <p className="text-sm text-gray-400 mt-2">
                        Send **{selectedTransaction.amount.toFixed(2)} USDT**
                        to:
                        <br />
                        <span className="font-mono text-gray-200 break-all">
                          {selectedTransaction.cryptoWalletAddress}
                        </span>
                      </p>
                    </div>
                  )}
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label className="text-gray-300">User:</Label>
                  <span className="text-gray-200">
                    {selectedTransaction?.userId
                      ? `${selectedTransaction.userId.name} (${selectedTransaction.userId.email})`
                      : "N/A"}
                  </span>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label className="text-gray-300">Amount Requested:</Label>
                  <span className="text-gray-200">
                    ${selectedTransaction?.amount.toFixed(2)}
                  </span>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label className="text-gray-300">Admin Fee Applied:</Label>
                  <span className="text-gray-200">
                    $
                    {selectedTransaction?.adminFeeApplied
                      ? selectedTransaction.adminFeeApplied.toFixed(2)
                      : "0.00"}
                  </span>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label className="text-gray-300">Wallet Address:</Label>
                  <span className="text-gray-200 break-all">
                    {selectedTransaction?.cryptoWalletAddress}
                  </span>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label className="text-gray-300">Date:</Label>
                  <span className="text-gray-200">
                    {selectedTransaction?.transactionDate
                      ? format(
                        new Date(selectedTransaction.transactionDate),
                        "PPP p"
                      )
                      : "N/A"}
                  </span>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label className="text-gray-300">Status:</Label>
                  <span
                    className={`font-semibold ${getStatusColor(
                      selectedTransaction?.status
                    )}`}
                  >
                    {selectedTransaction?.status
                      ? selectedTransaction.status.charAt(0).toUpperCase() +
                      selectedTransaction.status.slice(1)
                      : "N/A"}
                  </span>
                </div>
                {selectedTransaction?.adminActionNotes && (
                  <div className="grid grid-cols-2 items-start gap-4">
                    <Label className="text-gray-300">Admin Notes:</Label>
                    <span className="text-gray-200 text-wrap break-words">
                      {selectedTransaction.adminActionNotes}
                    </span>
                  </div>
                )}
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDetailsDialogOpen(false)}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

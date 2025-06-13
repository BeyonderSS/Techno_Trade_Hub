"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function WithdrawalTable({ withdrawals }) {
  // Format date to a readable string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get appropriate badge color based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-600 hover:bg-green-700">Completed</Badge>
      case "pending":
        return <Badge className="bg-yellow-600 hover:bg-yellow-700">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-600 hover:bg-red-700">Failed</Badge>
      default:
        return <Badge className="bg-gray-600 hover:bg-gray-700">{status}</Badge>
    }
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-800 bg-gray-950">
            <TableHead className="text-gray-300">Amount (USD)</TableHead>
            <TableHead className="text-gray-300">Date</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-gray-300">Transaction ID</TableHead>
            <TableHead className="text-gray-300">Wallet Address</TableHead>
            <TableHead className="text-gray-300">Fee</TableHead>
            <TableHead className="text-gray-300">Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {withdrawals.length > 0 ? (
            withdrawals.map((withdrawal) => (
              <TableRow key={withdrawal._id} className="border-gray-800 hover:bg-gray-800">
                <TableCell className="font-medium text-purple-400">${withdrawal.amount.toFixed(2)}</TableCell>
                <TableCell>{formatDate(withdrawal.transactionDate)}</TableCell>
                <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                <TableCell className="font-mono text-sm">{withdrawal.txnId}</TableCell>
                <TableCell className="font-mono text-sm">{withdrawal.cryptoWalletAddress}</TableCell>
                <TableCell>
                  {withdrawal.adminFeeApplied > 0 ? `$${withdrawal.adminFeeApplied.toFixed(2)}` : "-"}
                </TableCell>
                <TableCell className="max-w-xs truncate">{withdrawal.adminActionNotes || "-"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                No withdrawal records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
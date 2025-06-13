"use client"

import { useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import ReportHeader from "@/components/report-header"
import { Badge } from "../../../../components/ui/batch"
import { Users, DollarSign } from "lucide-react"

const mockData = [
  {
    _id: "65b21c4e7f3a8b001a1c3b5d",
    userId: {
      _id: "65a0c9e2b3f4d5a6b7c8e9f0",
      name: "Jane Doe",
      email: "jane.doe@example.com",
    },
    amount: 50.0,
    transactionDate: "2024-05-15T10:00:00.000Z",
    status: "completed",
    type: "direct_referral_bonus",
    txnId: "DRB-001-XYZ",
    relatedEntityId: "65a0c9e2b3f4d5a6b7c8e9f1",
    adminFeeApplied: 0,
    relatedEntityDetails: {
      type: "User",
      _id: "65a0c9e2b3f4d5a6b7c8e9f1",
      name: "Referred User One",
      email: "referred.one@example.com",
    },
  },
  {
    _id: "65c32d5f8a4b9c002a2d4c6e",
    userId: {
      _id: "65a0c9e2b3f4d5a6b7c8e9f0",
      name: "Jane Doe",
      email: "jane.doe@example.com",
    },
    amount: 75.0,
    transactionDate: "2024-05-20T14:30:00.000Z",
    status: "completed",
    type: "direct_referral_bonus",
    txnId: "DRB-002-ABC",
    relatedEntityId: "65c32d5f8a4b9c002a2d4c6f",
    adminFeeApplied: 0,
    relatedEntityDetails: {
      type: "Investment",
      _id: "65c32d5f8a4b9c002a2d4c6f",
      amount: 1500.0,
      startDate: "2024-05-18T09:00:00.000Z",
      status: "active",
    },
  },
]

export default function ReferralIncomePage() {
  const [data] = useState(mockData)

  const columns = [
    {
      accessorKey: "txnId",
      header: "Transaction ID",
    },
    {
      accessorKey: "userId.name",
      header: "User",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.userId.name}</div>
          <div className="text-sm text-muted-foreground">{row.original.userId.email}</div>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="font-medium text-right">
          ${row.original.amount.toFixed(2)}
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
    {
      accessorKey: "relatedEntityDetails",
      header: "Referral Details",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.relatedEntityDetails.type}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.relatedEntityDetails.type === "User"
              ? row.original.relatedEntityDetails.name
              : `$${(row.original.relatedEntityDetails.amount || 0).toFixed(2)}`}
          </div>
        </div>
      ),
    },
  ]

  const stats = [
    {
      label: "Total Referral Income",
      value: "$125.00",
      change: "+15% from last month",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      label: "Total Referrals",
      value: "2",
      icon: <Users className="h-5 w-5" />,
    },
  ]

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-10 max-w-7xl mx-auto">
      <ReportHeader
        title="Referral Income"
        description="Track your direct referral bonuses and related details"
        stats={stats}
      />
      <div className="bg-black/40  border  border-amber-50 dark:bg-black/50 shadow rounded-xl p-4 sm:p-6">
        <DataTable columns={columns} data={data} searchColumn="txnId" />
      </div>
    </div>
  )
}
